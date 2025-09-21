/**
 * 🗄️ АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ
 * 
 * Этот файл создает базовые данные при развертывании на новом сервере.
 * Запускается автоматически при старте сервера если база данных пустая.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🏷️ Создание категорий по умолчанию
 */
async function createDefaultCategories() {
    console.log('🏷️ Создание категорий по умолчанию...');
    
    const categories = [
        { name: JSON.stringify({ en: "Excursions", ru: "Экскурсии" }) },
        { name: JSON.stringify({ en: "Cultural Tours", ru: "Культурные туры" }) },
        { name: JSON.stringify({ en: "Adventure Tours", ru: "Приключенческие туры" }) },
        { name: JSON.stringify({ en: "Mountain Tours", ru: "Горные туры" }) },
        { name: JSON.stringify({ en: "Nature Tours", ru: "Природные туры" }) },
        { name: JSON.stringify({ en: "City Tours", ru: "Городские туры" }) },
        { name: JSON.stringify({ en: "Historical Tours", ru: "Исторические туры" }) },
        { name: JSON.stringify({ en: "Silk Road Tours", ru: "Туры по Шелковому пути" }) },
        { name: JSON.stringify({ en: "Trekking & Hiking", ru: "Треккинг и пешие походы" }) },
        { name: JSON.stringify({ en: "Gastronomic Tours", ru: "Гастрономические туры" }) },
        { name: JSON.stringify({ en: "Multi-day Tours", ru: "Многодневные туры" }) },
        { name: JSON.stringify({ en: "Day Tours", ru: "Однодневные туры" }) },
        { name: JSON.stringify({ en: "Photographic Tours", ru: "Фототуры" }) }
    ];
    
    for (const category of categories) {
        await prisma.category.create({
            data: category
        });
    }
    
    console.log(`✅ Создано ${categories.length} категорий по умолчанию`);
}

/**
 * 📋 Создание блоков туров по умолчанию
 */
async function createDefaultTourBlocks() {
    console.log('📋 Создание блоков туров по умолчанию...');
    
    const tourBlocks = [
        {
            title: JSON.stringify({ ru: "Популярные туры", en: "Popular Tours" }),
            description: JSON.stringify({ ru: "Самые востребованные туры нашей компании", en: "Most popular tours of our company" }),
            slug: "popular-tours",
            isActive: true,
            sortOrder: 1
        },
        {
            title: JSON.stringify({ ru: "Рекомендованные туры по Центральной Азии", en: "Recommended Central Asia Tours" }),
            description: JSON.stringify({ ru: "Лучшие туры для знакомства с Центральной Азией", en: "Best tours to discover Central Asia" }),
            slug: "recommended-central-asia",
            isActive: true,
            sortOrder: 2
        },
        {
            title: JSON.stringify({ ru: "Туры по Таджикистану", en: "Tajikistan Tours" }),
            description: JSON.stringify({ ru: "Откройте для себя красоты Таджикистана", en: "Discover the beauty of Tajikistan" }),
            slug: "tajikistan-tours",
            isActive: true,
            sortOrder: 3
        },
        {
            title: JSON.stringify({ ru: "Туры по Узбекистану", en: "Uzbekistan Tours" }),
            description: JSON.stringify({ ru: "Исследуйте древние города Узбекистана", en: "Explore ancient cities of Uzbekistan" }),
            slug: "uzbekistan-tours",
            isActive: true,
            sortOrder: 4
        },
        {
            title: JSON.stringify({ ru: "Туры по Кыргызстану", en: "Kyrgyzstan Tours" }),
            description: JSON.stringify({ ru: "Горные приключения в Кыргызстане", en: "Mountain adventures in Kyrgyzstan" }),
            slug: "kyrgyzstan-tours",
            isActive: true,
            sortOrder: 5
        },
        {
            title: JSON.stringify({ ru: "Эксклюзивные туры", en: "Exclusive Tours" }),
            description: JSON.stringify({ ru: "Уникальные и эксклюзивные туристические программы", en: "Unique and exclusive tour programs" }),
            slug: "exclusive-tours",
            isActive: true,
            sortOrder: 6
        }
    ];
    
    for (const block of tourBlocks) {
        await prisma.tourBlock.create({
            data: block
        });
    }
    
    console.log(`✅ Создано ${tourBlocks.length} блоков туров по умолчанию`);
}

/**
 * 🌍 Создание стран по умолчанию
 */
async function createDefaultCountries() {
    console.log('🌍 Создание стран по умолчанию...');
    
    const countries = [
        { name: "Таджикистан", nameRu: "Таджикистан", nameEn: "Tajikistan", code: "TJ" },
        { name: "Узбекистан", nameRu: "Узбекистан", nameEn: "Uzbekistan", code: "UZ" },
        { name: "Кыргызстан", nameRu: "Кыргызстан", nameEn: "Kyrgyzstan", code: "KG" },
        { name: "Казахстан", nameRu: "Казахстан", nameEn: "Kazakhstan", code: "KZ" },
        { name: "Туркменистан", nameRu: "Туркменистан", nameEn: "Turkmenistan", code: "TM" }
    ];
    
    for (const country of countries) {
        await prisma.country.create({
            data: country
        });
    }
    
    console.log(`✅ Создано ${countries.length} стран по умолчанию`);
}

/**
 * 🏙️ Создание городов по умолчанию
 */
async function createDefaultCities() {
    console.log('🏙️ Создание городов по умолчанию...');
    
    // Сначала получаем ID стран
    const countries = await prisma.country.findMany();
    const countryMap = new Map();
    countries.forEach(country => {
        countryMap.set(country.name, country.id);
    });
    
    const cities = [
        { name: "Душанбе", nameRu: "Душанбе", nameEn: "Dushanbe", countryId: countryMap.get("Таджикистан") },
        { name: "Худжанд", nameRu: "Худжанд", nameEn: "Khujand", countryId: countryMap.get("Таджикистан") },
        { name: "Хорог", nameRu: "Хорог", nameEn: "Khorog", countryId: countryMap.get("Таджикистан") },
        { name: "Ташкент", nameRu: "Ташкент", nameEn: "Tashkent", countryId: countryMap.get("Узбекистан") },
        { name: "Самарканд", nameRu: "Самарканд", nameEn: "Samarkand", countryId: countryMap.get("Узбекистан") },
        { name: "Бухара", nameRu: "Бухара", nameEn: "Bukhara", countryId: countryMap.get("Узбекистан") },
        { name: "Бишкек", nameRu: "Бишкек", nameEn: "Bishkek", countryId: countryMap.get("Кыргызстан") },
        { name: "Астана", nameRu: "Астана", nameEn: "Astana", countryId: countryMap.get("Казахстан") },
        { name: "Алматы", nameRu: "Алматы", nameEn: "Almaty", countryId: countryMap.get("Казахстан") },
        { name: "Ашхабад", nameRu: "Ашхабад", nameEn: "Ashgabat", countryId: countryMap.get("Туркменистан") }
    ];
    
    for (const city of cities) {
        if (city.countryId) {
            await prisma.city.create({
                data: city
            });
        }
    }
    
    console.log(`✅ Создано ${cities.length} городов по умолчанию`);
}

/**
 * 🎬 Создание слайдов по умолчанию
 */
async function createDefaultSlides() {
    console.log('🎬 Создание слайдов по умолчанию...');
    
    const slides = [
        {
            title: JSON.stringify({ 
                ru: "Добро пожаловать в Центральную Азию", 
                en: "Welcome to Central Asia" 
            }),
            description: JSON.stringify({ 
                ru: "Откройте для себя удивительные пейзажи и богатую культуру региона", 
                en: "Discover amazing landscapes and rich culture of the region" 
            }),
            image: "/public/images/default-slide-1.jpg",
            link: "/tours",
            isActive: true,
            sortOrder: 1
        },
        {
            title: JSON.stringify({ 
                ru: "Незабываемые приключения", 
                en: "Unforgettable Adventures" 
            }),
            description: JSON.stringify({ 
                ru: "Горы, озера, древние города - все это ждет вас", 
                en: "Mountains, lakes, ancient cities - all this awaits you" 
            }),
            image: "/public/images/default-slide-2.jpg", 
            link: "/tours",
            isActive: true,
            sortOrder: 2
        },
        {
            title: JSON.stringify({ 
                ru: "Экспертные гиды", 
                en: "Expert Guides" 
            }),
            description: JSON.stringify({ 
                ru: "Наши опытные гиды покажут вам лучшие места региона", 
                en: "Our experienced guides will show you the best places in the region" 
            }),
            image: "/public/images/default-slide-3.jpg",
            link: "/guides", 
            isActive: true,
            sortOrder: 3
        }
    ];
    
    for (const slide of slides) {
        await prisma.slide.create({
            data: slide
        });
    }
    
    console.log(`✅ Создано ${slides.length} слайдов по умолчанию`);
}

/**
 * 🔍 Проверка инициализации базы данных
 */
async function checkDatabaseInitialization() {
    console.log('🔍 Проверка инициализации базы данных...');
    
    try {
        // Проверяем количество записей
        const [categoryCount, tourBlockCount, countryCount, cityCount, slideCount] = await Promise.all([
            prisma.category.count(),
            prisma.tourBlock.count(),
            prisma.country.count(),
            prisma.city.count(),
            prisma.slide.count()
        ]);
        
        console.log(`📊 Текущие данные в БД:`);
        console.log(`   Categories: ${categoryCount}`);
        console.log(`   Tour Blocks: ${tourBlockCount}`);
        console.log(`   Countries: ${countryCount}`);
        console.log(`   Cities: ${cityCount}`);
        console.log(`   Slides: ${slideCount}`);
        
        return {
            categories: categoryCount,
            tourBlocks: tourBlockCount,
            countries: countryCount,
            cities: cityCount,
            slides: slideCount
        };
    } catch (error) {
        console.error('❌ Ошибка при проверке БД:', error);
        return null;
    }
}

/**
 * 🚀 ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
 */
export async function initializeDatabase() {
    console.log('🚀 Начинаем инициализацию базы данных...');
    
    try {
        const stats = await checkDatabaseInitialization();
        
        if (!stats) {
            console.log('❌ Не удалось проверить БД, пропускаем инициализацию');
            return false;
        }
        
        // Создаем недостающие данные
        if (stats.categories === 0) {
            await createDefaultCategories();
        } else {
            console.log('✅ Категории уже существуют, пропускаем создание');
        }
        
        if (stats.countries === 0) {
            await createDefaultCountries();
        } else {
            console.log('✅ Страны уже существуют, пропускаем создание');
        }
        
        if (stats.cities === 0) {
            await createDefaultCities();
        } else {
            console.log('✅ Города уже существуют, пропускаем создание');
        }
        
        if (stats.tourBlocks === 0) {
            await createDefaultTourBlocks();
        } else {
            console.log('✅ Блоки туров уже существуют, пропускаем создание');
        }
        
        if (stats.slides === 0) {
            await createDefaultSlides();
        } else {
            console.log('✅ Слайды уже существуют, пропускаем создание');
        }
        
        console.log('🎉 Инициализация базы данных завершена!');
        
        // Финальная проверка
        await checkDatabaseInitialization();
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка при инициализации БД:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * 🔧 Принудительная переинициализация (для разработки)
 */
export async function forceResetDatabase() {
    console.log('🔧 ПРИНУДИТЕЛЬНАЯ ПЕРЕИНИЦИАЛИЗАЦИЯ БД...');
    
    try {
        // Удаляем все данные
        await prisma.tourBlockAssignment.deleteMany();
        await prisma.slide.deleteMany();
        await prisma.city.deleteMany();
        await prisma.country.deleteMany();
        await prisma.tourBlock.deleteMany();
        await prisma.category.deleteMany();
        
        console.log('🗑️ Все базовые данные удалены');
        
        // Создаем заново
        await initializeDatabase();
        
        return true;
    } catch (error) {
        console.error('❌ Ошибка при сбросе БД:', error);
        return false;
    }
}