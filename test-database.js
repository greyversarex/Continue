#!/usr/bin/env node
const { initializeDatabase, getAllTours, getAllUsers, getAllBookings, getAllPromotions, getDatabaseStats } = require('./src/database/init');

async function testDatabase() {
    console.log('🧪 Тестирование базы данных SQLite...\n');

    try {
        // Инициализация базы данных
        const success = await initializeDatabase();
        if (!success) {
            console.error('❌ Не удалось инициализировать базу данных');
            return;
        }

        console.log('\n📊 Проверка данных в таблицах:\n');

        // Получение статистики
        const stats = await getDatabaseStats();
        if (stats) {
            console.log('📈 Статистика базы данных:');
            console.log(`   • Туры: ${stats.tours}`);
            console.log(`   • Пользователи: ${stats.users}`);
            console.log(`   • Бронирования: ${stats.bookings}`);
            console.log(`   • Акции: ${stats.promotions}\n`);
        }

        // Проверка туров
        console.log('🏔️  Туры:');
        const tours = await getAllTours();
        if (tours) {
            console.log(tours);
        }

        console.log('\n👥 Пользователи:');
        const users = await getAllUsers();
        if (users) {
            console.log(users);
        }

        console.log('\n📋 Бронирования:');
        const bookings = await getAllBookings();
        if (bookings) {
            console.log(bookings);
        }

        console.log('\n🎯 Акции:');
        const promotions = await getAllPromotions();
        if (promotions) {
            console.log(promotions);
        }

        console.log('\n✅ Тестирование завершено успешно!');

    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error.message);
    }
}

// Запуск тестирования
testDatabase();