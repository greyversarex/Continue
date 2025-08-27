const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const DB_PATH = path.join(__dirname, '../../database.db');

// Функция для выполнения SQL команд через sqlite3 CLI
async function executeSQLCommand(sql) {
    try {
        const command = `sqlite3 "${DB_PATH}" "${sql}"`;
        const { stdout, stderr } = await execAsync(command);
        if (stderr && !stderr.includes('already exists')) {
            console.error('SQL Error:', stderr);
            throw new Error(stderr);
        }
        return stdout;
    } catch (error) {
        throw error;
    }
}

// Функция для выполнения SQL запросов с результатами
async function executeSQLQuery(sql) {
    try {
        const command = `sqlite3 "${DB_PATH}" "${sql}"`;
        const { stdout } = await execAsync(command);
        return stdout.trim();
    } catch (error) {
        throw error;
    }
}

// Создание базы данных и таблиц
async function initializeTables() {
    console.log('📋 Создание таблиц базы данных...');
    
    const tables = [
        // Таблица туров
        `CREATE TABLE IF NOT EXISTS tours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            country TEXT,
            price REAL,
            category TEXT,
            start_date TEXT,
            end_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        
        // Таблица пользователей
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            role TEXT DEFAULT 'client',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        
        // Таблица бронирований
        `CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            tour_id INTEGER,
            status TEXT DEFAULT 'pending',
            booking_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (tour_id) REFERENCES tours(id)
        );`,
        
        // Таблица акций
        `CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            discount REAL,
            start_date TEXT,
            end_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
    ];

    for (const tableSQL of tables) {
        await executeSQLCommand(tableSQL);
    }
    
    console.log('✅ Все таблицы успешно созданы');
}

// Добавление тестовых данных
async function insertTestData() {
    // Проверяем, есть ли уже данные
    const count = await executeSQLQuery("SELECT COUNT(*) FROM tours;");
    
    if (parseInt(count) > 0) {
        console.log('📊 Тестовые данные уже существуют');
        return;
    }

    console.log('📊 Добавление тестовых данных...');

    // Добавление пользователей
    const users = [
        ['Администратор', 'admin@bunyod-tour.com', 'admin'],
        ['Алиев Шохзод', 'shohzod@email.com', 'client'],
        ['Марьям Насирова', 'maryam@email.com', 'client'],
        ['Турагент Фарход', 'farhod@bunyod-tour.com', 'agent']
    ];

    for (const [name, email, role] of users) {
        await executeSQLCommand(`INSERT INTO users (name, email, role) VALUES ('${name}', '${email}', '${role}');`);
    }

    // Добавление туров
    const tours = [
        [
            'Однодневный тур по Душанбе',
            'Посетите исторические памятники столицы Таджикистана',
            'Таджикистан',
            45.0,
            'однодневный',
            '2024-03-01',
            '2024-03-01'
        ],
        [
            'Трек к Искандеркулю',
            'Приключенческий поход к самому красивому озеру в Фанских горах',
            'Таджикистан',
            120.0,
            'экологический',
            '2024-04-15',
            '2024-04-17'
        ],
        [
            'Тур по Памиру',
            'Незабываемое путешествие по Крыше мира',
            'Таджикистан',
            350.0,
            'многодневный',
            '2024-05-10',
            '2024-05-18'
        ],
        [
            'Культурный тур по Худжанду',
            'Откройте древнюю историю второго по величине города Таджикистана',
            'Таджикистан',
            80.0,
            'культурный',
            '2024-06-05',
            '2024-06-06'
        ]
    ];

    for (const [title, description, country, price, category, start_date, end_date] of tours) {
        await executeSQLCommand(`INSERT INTO tours (title, description, country, price, category, start_date, end_date) VALUES ('${title}', '${description}', '${country}', ${price}, '${category}', '${start_date}', '${end_date}');`);
    }

    // Добавление акций
    await executeSQLCommand(`INSERT INTO promotions (title, description, discount, start_date, end_date) VALUES ('Весенняя скидка 2024', 'Скидка 15% на все туры при бронировании до 31 марта', 15.0, '2024-03-01', '2024-03-31');`);

    // Добавление бронирований
    const bookings = [
        [2, 1, 'confirmed', '2024-02-15'],
        [3, 2, 'pending', '2024-02-20'],
        [2, 3, 'confirmed', '2024-02-25']
    ];

    for (const [user_id, tour_id, status, booking_date] of bookings) {
        await executeSQLCommand(`INSERT INTO bookings (user_id, tour_id, status, booking_date) VALUES (${user_id}, ${tour_id}, '${status}', '${booking_date}');`);
    }

    console.log('✅ Все тестовые данные успешно добавлены');
}

// Основная функция инициализации
async function initializeDatabase() {
    try {
        console.log('🚀 Инициализация SQLite базы данных...');
        
        // Создаем базу данных, если она не существует
        if (!fs.existsSync(DB_PATH)) {
            await executeSQLCommand('.quit');
            console.log('📁 Файл базы данных создан');
        }
        
        await initializeTables();
        await insertTestData();
        
        console.log('✅ База данных успешно инициализирована');
        console.log(`📍 Путь к базе данных: ${DB_PATH}`);
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка инициализации базы данных:', error.message);
        return false;
    }
}

// Функции для работы с базой данных
async function getAllTours() {
    try {
        const result = await executeSQLQuery("SELECT * FROM tours;");
        return result;
    } catch (error) {
        console.error('Ошибка получения туров:', error);
        return null;
    }
}

async function getAllUsers() {
    try {
        const result = await executeSQLQuery("SELECT * FROM users;");
        return result;
    } catch (error) {
        console.error('Ошибка получения пользователей:', error);
        return null;
    }
}

async function getAllBookings() {
    try {
        const result = await executeSQLQuery(`
            SELECT b.*, u.name as user_name, t.title as tour_title 
            FROM bookings b 
            LEFT JOIN users u ON b.user_id = u.id 
            LEFT JOIN tours t ON b.tour_id = t.id;
        `);
        return result;
    } catch (error) {
        console.error('Ошибка получения бронирований:', error);
        return null;
    }
}

async function getAllPromotions() {
    try {
        const result = await executeSQLQuery("SELECT * FROM promotions;");
        return result;
    } catch (error) {
        console.error('Ошибка получения акций:', error);
        return null;
    }
}

// Функция для получения статистики
async function getDatabaseStats() {
    try {
        const toursCount = await executeSQLQuery("SELECT COUNT(*) FROM tours;");
        const usersCount = await executeSQLQuery("SELECT COUNT(*) FROM users;");
        const bookingsCount = await executeSQLQuery("SELECT COUNT(*) FROM bookings;");
        const promotionsCount = await executeSQLQuery("SELECT COUNT(*) FROM promotions;");
        
        return {
            tours: parseInt(toursCount),
            users: parseInt(usersCount),
            bookings: parseInt(bookingsCount),
            promotions: parseInt(promotionsCount)
        };
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
        return null;
    }
}

module.exports = {
    initializeDatabase,
    getAllTours,
    getAllUsers,
    getAllBookings,
    getAllPromotions,
    getDatabaseStats,
    executeSQLCommand,
    executeSQLQuery,
    DB_PATH
};