"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PublicController {
    static async getHomePageData(req, res, next) {
        try {
            const { lang = 'ru' } = req.query;
            console.log('Loading homepage data...');
            const contentBlocks = await prisma.contentBlock.findMany({
                where: { isActive: true },
                orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }]
            });
            console.log('Content blocks loaded:', contentBlocks.length);
            const siteSettings = await prisma.siteSetting.findMany({
                where: { isActive: true }
            });
            console.log('Site settings loaded:', siteSettings.length);
            const tours = [];
            const categories = [];
            const parseMultilingualData = (data, langCode) => {
                return data.map((item) => {
                    const parsed = { ...item };
                    if (item.title && typeof item.title === 'string') {
                        try {
                            const titleObj = JSON.parse(item.title);
                            parsed.title = titleObj[langCode] || titleObj.ru || titleObj.en || item.title;
                        }
                        catch (e) {
                            parsed.title = item.title;
                        }
                    }
                    if (item.content && typeof item.content === 'string') {
                        try {
                            const contentObj = JSON.parse(item.content);
                            parsed.content = contentObj[langCode] || contentObj.ru || contentObj.en || item.content;
                        }
                        catch (e) {
                            parsed.content = item.content;
                        }
                    }
                    if (item.description && typeof item.description === 'string') {
                        try {
                            const descObj = JSON.parse(item.description);
                            parsed.description = descObj[langCode] || descObj.ru || descObj.en || item.description;
                        }
                        catch (e) {
                            parsed.description = item.description;
                        }
                    }
                    if (item.name && typeof item.name === 'string') {
                        try {
                            const nameObj = JSON.parse(item.name);
                            parsed.name = nameObj[langCode] || nameObj.ru || nameObj.en || item.name;
                        }
                        catch (e) {
                            parsed.name = item.name;
                        }
                    }
                    if (item.value && typeof item.value === 'string' && item.type === 'json') {
                        try {
                            const valueObj = JSON.parse(item.value);
                            parsed.value = valueObj[langCode] || valueObj.ru || valueObj.en || item.value;
                        }
                        catch (e) {
                            parsed.value = item.value;
                        }
                    }
                    if (item.label && typeof item.label === 'string') {
                        try {
                            const labelObj = JSON.parse(item.label);
                            parsed.label = labelObj[langCode] || labelObj.ru || labelObj.en || item.label;
                        }
                        catch (e) {
                            parsed.label = item.label;
                        }
                    }
                    return parsed;
                });
            };
            const parsedTours = tours.map((tour) => {
                const parsed = { ...tour };
                try {
                    const titleObj = JSON.parse(tour.title);
                    parsed.title = titleObj[lang] || titleObj.ru || titleObj.en || tour.title;
                }
                catch (e) {
                    parsed.title = tour.title;
                }
                try {
                    const descObj = JSON.parse(tour.description);
                    parsed.description = descObj[lang] || descObj.ru || descObj.en || tour.description;
                }
                catch (e) {
                    parsed.description = tour.description;
                }
                if (tour.category) {
                    try {
                        const catNameObj = JSON.parse(tour.category.name);
                        parsed.category.name = catNameObj[lang] || catNameObj.ru || catNameObj.en || tour.category.name;
                    }
                    catch (e) {
                        parsed.category.name = tour.category.name;
                    }
                }
                return parsed;
            });
            const parsedBlocks = parseMultilingualData(contentBlocks, lang);
            const blocksBySection = parsedBlocks.reduce((acc, block) => {
                if (!acc[block.section]) {
                    acc[block.section] = {};
                }
                acc[block.section][block.key] = {
                    title: block.title,
                    content: block.content,
                    type: block.type,
                    metadata: block.metadata
                };
                return acc;
            }, {});
            const parsedSettings = parseMultilingualData(siteSettings, lang);
            const settingsObj = parsedSettings.reduce((acc, setting) => {
                acc[setting.key] = setting.type === 'json' ? setting.value : setting.value;
                return acc;
            }, {});
            const parsedCategories = parseMultilingualData(categories, lang);
            const response = {
                success: true,
                data: {
                    content: blocksBySection,
                    settings: settingsObj,
                    tours: parsedTours,
                    categories: parsedCategories,
                    language: lang
                },
                message: 'Homepage data retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getPageBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const { lang = 'ru' } = req.query;
            const page = await prisma.page.findUnique({
                where: {
                    slug,
                    isPublished: true
                }
            });
            if (!page) {
                return res.status(404).json({
                    success: false,
                    error: 'Page not found'
                });
            }
            const parsed = { ...page };
            try {
                const titleObj = JSON.parse(page.title);
                parsed.title = titleObj[lang] || titleObj.ru || titleObj.en || page.title;
            }
            catch (e) {
                parsed.title = page.title;
            }
            try {
                const contentObj = JSON.parse(page.content);
                parsed.content = contentObj[lang] || contentObj.ru || contentObj.en || page.content;
            }
            catch (e) {
                parsed.content = page.content;
            }
            if (page.metaTitle) {
                try {
                    const metaTitleObj = JSON.parse(page.metaTitle);
                    parsed.metaTitle = metaTitleObj[lang] || metaTitleObj.ru || metaTitleObj.en || page.metaTitle;
                }
                catch (e) {
                    parsed.metaTitle = page.metaTitle;
                }
            }
            if (page.metaDesc) {
                try {
                    const metaDescObj = JSON.parse(page.metaDesc);
                    parsed.metaDesc = metaDescObj[lang] || metaDescObj.ru || metaDescObj.en || page.metaDesc;
                }
                catch (e) {
                    parsed.metaDesc = page.metaDesc;
                }
            }
            const response = {
                success: true,
                data: parsed,
                message: 'Page retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getMenu(req, res, next) {
        try {
            const { lang = 'ru' } = req.query;
            const menuItems = await prisma.menuItem.findMany({
                where: {
                    isActive: true,
                    parentId: null
                },
                include: {
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' }
                    }
                },
                orderBy: { sortOrder: 'asc' }
            });
            const parseMenuItems = (items, langCode) => {
                return items.map((item) => {
                    const parsed = { ...item };
                    try {
                        const titleObj = JSON.parse(item.title);
                        parsed.title = titleObj[langCode] || titleObj.ru || titleObj.en || item.title;
                    }
                    catch (e) {
                        parsed.title = item.title;
                    }
                    if (item.children && item.children.length > 0) {
                        parsed.children = parseMenuItems(item.children, langCode);
                    }
                    return parsed;
                });
            };
            const parsedMenu = parseMenuItems(menuItems, lang);
            const response = {
                success: true,
                data: parsedMenu,
                message: 'Menu retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
    static async getNews(req, res, next) {
        try {
            const { lang = 'ru', limit = 6 } = req.query;
            const news = await prisma.newsPost.findMany({
                where: {
                    isPublished: true,
                    publishDate: {
                        lte: new Date()
                    }
                },
                orderBy: { publishDate: 'desc' },
                take: parseInt(limit)
            });
            const parsedNews = news.map((post) => {
                const parsed = { ...post };
                try {
                    const titleObj = JSON.parse(post.title);
                    parsed.title = titleObj[lang] || titleObj.ru || titleObj.en || post.title;
                }
                catch (e) {
                    parsed.title = post.title;
                }
                if (post.excerpt) {
                    try {
                        const excerptObj = JSON.parse(post.excerpt);
                        parsed.excerpt = excerptObj[lang] || excerptObj.ru || excerptObj.en || post.excerpt;
                    }
                    catch (e) {
                        parsed.excerpt = post.excerpt;
                    }
                }
                try {
                    const contentObj = JSON.parse(post.content);
                    parsed.content = contentObj[lang] || contentObj.ru || contentObj.en || post.content;
                }
                catch (e) {
                    parsed.content = post.content;
                }
                if (post.tags) {
                    try {
                        parsed.tags = JSON.parse(post.tags);
                    }
                    catch (e) {
                        parsed.tags = [];
                    }
                }
                return parsed;
            });
            const response = {
                success: true,
                data: parsedNews,
                message: 'News retrieved successfully'
            };
            return res.status(200).json(response);
        }
        catch (error) {
            return next(error);
        }
    }
}
exports.PublicController = PublicController;
//# sourceMappingURL=publicController.js.map