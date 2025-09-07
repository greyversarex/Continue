"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectStorageService = exports.ObjectNotFoundError = exports.objectStorageClient = void 0;
const storage_1 = require("@google-cloud/storage");
const crypto_1 = require("crypto");
const objectAcl_1 = require("./objectAcl");
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
exports.objectStorageClient = new storage_1.Storage({
    credentials: {
        audience: "replit",
        subject_token_type: "access_token",
        token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
        type: "external_account",
        credential_source: {
            url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
            format: {
                type: "json",
                subject_token_field_name: "access_token",
            },
        },
        universe_domain: "googleapis.com",
    },
    projectId: "",
});
class ObjectNotFoundError extends Error {
    constructor() {
        super("Object not found");
        this.name = "ObjectNotFoundError";
        Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
    }
}
exports.ObjectNotFoundError = ObjectNotFoundError;
class ObjectStorageService {
    constructor() { }
    getPublicObjectSearchPaths() {
        const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
        const paths = Array.from(new Set(pathsStr
            .split(",")
            .map((path) => path.trim())
            .filter((path) => path.length > 0)));
        if (paths.length === 0) {
            throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
                "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths).");
        }
        return paths;
    }
    getPrivateObjectDir() {
        const dir = process.env.PRIVATE_OBJECT_DIR || "";
        if (!dir) {
            throw new Error("PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
                "tool and set PRIVATE_OBJECT_DIR env var.");
        }
        return dir;
    }
    async searchPublicObject(filePath) {
        for (const searchPath of this.getPublicObjectSearchPaths()) {
            const fullPath = `${searchPath}/${filePath}`;
            const { bucketName, objectName } = parseObjectPath(fullPath);
            const bucket = exports.objectStorageClient.bucket(bucketName);
            const file = bucket.file(objectName);
            const [exists] = await file.exists();
            if (exists) {
                return file;
            }
        }
        return null;
    }
    async downloadObject(file, res, cacheTtlSec = 3600) {
        try {
            const [metadata] = await file.getMetadata();
            const aclPolicy = await (0, objectAcl_1.getObjectAclPolicy)(file);
            const isPublic = aclPolicy?.visibility === "public";
            res.set({
                "Content-Type": metadata.contentType || "application/octet-stream",
                "Content-Length": metadata.size,
                "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
            });
            const stream = file.createReadStream();
            stream.on("error", (err) => {
                console.error("Stream error:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Error streaming file" });
                }
            });
            stream.pipe(res);
        }
        catch (error) {
            console.error("Error downloading file:", error);
            if (!res.headersSent) {
                res.status(500).json({ error: "Error downloading file" });
            }
        }
    }
    async getObjectEntityUploadURL() {
        const privateObjectDir = this.getPrivateObjectDir();
        if (!privateObjectDir) {
            throw new Error("PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
                "tool and set PRIVATE_OBJECT_DIR env var.");
        }
        const objectId = (0, crypto_1.randomUUID)();
        const fullPath = `${privateObjectDir}/uploads/${objectId}`;
        const { bucketName, objectName } = parseObjectPath(fullPath);
        return signObjectURL({
            bucketName,
            objectName,
            method: "PUT",
            ttlSec: 900,
        });
    }
    async getObjectEntityFile(objectPath) {
        if (!objectPath.startsWith("/objects/")) {
            throw new ObjectNotFoundError();
        }
        const parts = objectPath.slice(1).split("/");
        if (parts.length < 2) {
            throw new ObjectNotFoundError();
        }
        const entityId = parts.slice(1).join("/");
        let entityDir = this.getPrivateObjectDir();
        if (!entityDir.endsWith("/")) {
            entityDir = `${entityDir}/`;
        }
        const objectEntityPath = `${entityDir}${entityId}`;
        const { bucketName, objectName } = parseObjectPath(objectEntityPath);
        const bucket = exports.objectStorageClient.bucket(bucketName);
        const objectFile = bucket.file(objectName);
        const [exists] = await objectFile.exists();
        if (!exists) {
            throw new ObjectNotFoundError();
        }
        return objectFile;
    }
    normalizeObjectEntityPath(rawPath) {
        if (!rawPath.startsWith("https://storage.googleapis.com/")) {
            return rawPath;
        }
        const url = new URL(rawPath);
        const rawObjectPath = url.pathname;
        let objectEntityDir = this.getPrivateObjectDir();
        if (!objectEntityDir.endsWith("/")) {
            objectEntityDir = `${objectEntityDir}/`;
        }
        if (!rawObjectPath.startsWith(objectEntityDir)) {
            return rawObjectPath;
        }
        const entityId = rawObjectPath.slice(objectEntityDir.length);
        return `/objects/${entityId}`;
    }
    async trySetObjectEntityAclPolicy(rawPath, aclPolicy) {
        const normalizedPath = this.normalizeObjectEntityPath(rawPath);
        if (!normalizedPath.startsWith("/")) {
            return normalizedPath;
        }
        const objectFile = await this.getObjectEntityFile(normalizedPath);
        await (0, objectAcl_1.setObjectAclPolicy)(objectFile, aclPolicy);
        return normalizedPath;
    }
    async canAccessObjectEntity({ userId, objectFile, requestedPermission, }) {
        return (0, objectAcl_1.canAccessObject)({
            userId,
            objectFile,
            requestedPermission: requestedPermission ?? objectAcl_1.ObjectPermission.READ,
        });
    }
}
exports.ObjectStorageService = ObjectStorageService;
function parseObjectPath(path) {
    if (!path.startsWith("/")) {
        path = `/${path}`;
    }
    const pathParts = path.split("/");
    if (pathParts.length < 3) {
        throw new Error("Invalid path: must contain at least a bucket name");
    }
    const bucketName = pathParts[1];
    const objectName = pathParts.slice(2).join("/");
    return {
        bucketName,
        objectName,
    };
}
async function signObjectURL({ bucketName, objectName, method, ttlSec, }) {
    const request = {
        bucket_name: bucketName,
        object_name: objectName,
        method,
        expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
    };
    const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error(`Failed to sign object URL, errorcode: ${response.status}, ` +
            `make sure you're running on Replit`);
    }
    const { signed_url: signedURL } = await response.json();
    return signedURL;
}
//# sourceMappingURL=objectStorage.js.map