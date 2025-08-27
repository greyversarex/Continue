const express = require('express');
const { getAllTours, getAllUsers, getAllBookings, getAllPromotions, getDatabaseStats, executeSQLQuery } = require('../database/init');

const router = express.Router();

// Получить все туры из SQLite базы
router.get('/sqlite/tours', async (req, res) => {
    try {
        const tours = await getAllTours();
        if (tours) {
            // Преобразуем строковый результат в массив объектов
            const toursArray = tours.split('\n').filter(line => line.trim()).map(line => {
                const parts = line.split('|');
                return {
                    id: parts[0],
                    title: parts[1],
                    description: parts[2],
                    country: parts[3],
                    price: parseFloat(parts[4]),
                    category: parts[5],
                    start_date: parts[6],
                    end_date: parts[7],
                    created_at: parts[8]
                };
            });
            res.json({ success: true, data: toursArray });
        } else {
            res.json({ success: false, message: 'Не удалось получить туры' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получить всех пользователей из SQLite базы
router.get('/sqlite/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        if (users) {
            const usersArray = users.split('\n').filter(line => line.trim()).map(line => {
                const parts = line.split('|');
                return {
                    id: parts[0],
                    name: parts[1],
                    email: parts[2],
                    role: parts[3],
                    created_at: parts[4]
                };
            });
            res.json({ success: true, data: usersArray });
        } else {
            res.json({ success: false, message: 'Не удалось получить пользователей' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получить все бронирования из SQLite базы
router.get('/sqlite/bookings', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        if (bookings) {
            const bookingsArray = bookings.split('\n').filter(line => line.trim()).map(line => {
                const parts = line.split('|');
                return {
                    id: parts[0],
                    user_id: parts[1],
                    tour_id: parts[2],
                    status: parts[3],
                    booking_date: parts[4],
                    created_at: parts[5],
                    user_name: parts[6],
                    tour_title: parts[7]
                };
            });
            res.json({ success: true, data: bookingsArray });
        } else {
            res.json({ success: false, message: 'Не удалось получить бронирования' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получить все акции из SQLite базы
router.get('/sqlite/promotions', async (req, res) => {
    try {
        const promotions = await getAllPromotions();
        if (promotions) {
            const promotionsArray = promotions.split('\n').filter(line => line.trim()).map(line => {
                const parts = line.split('|');
                return {
                    id: parts[0],
                    title: parts[1],
                    description: parts[2],
                    discount: parseFloat(parts[3]),
                    start_date: parts[4],
                    end_date: parts[5],
                    created_at: parts[6]
                };
            });
            res.json({ success: true, data: promotionsArray });
        } else {
            res.json({ success: false, message: 'Не удалось получить акции' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получить статистику базы данных
router.get('/sqlite/stats', async (req, res) => {
    try {
        const stats = await getDatabaseStats();
        if (stats) {
            res.json({ success: true, data: stats });
        } else {
            res.json({ success: false, message: 'Не удалось получить статистику' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Выполнить произвольный SQL запрос (только для разработки)
router.post('/sqlite/query', async (req, res) => {
    try {
        const { sql } = req.body;
        if (!sql) {
            return res.status(400).json({ success: false, message: 'SQL запрос не указан' });
        }

        const result = await executeSQLQuery(sql);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;