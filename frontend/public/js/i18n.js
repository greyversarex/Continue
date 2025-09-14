// === ЦЕНТРАЛЬНАЯ СИСТЕМА ИНТЕРНАЦИОНАЛИЗАЦИИ ===
// Используется на всех страницах сайта для двуязычной поддержки (RU/EN)

// === ЗАЩИТА ОТ ДВОЙНОЙ ЗАГРУЗКИ ===
(function() {
if (window.bunyodTourI18nLoaded) {
    return; // Просто выходим из IIFE без ошибки
}

// Помечаем что система загружена в самом начале
window.bunyodTourI18nLoaded = true;

// Глобальная переменная для текущего языка
window.currentLanguage = window.currentLanguage || 'ru'; // По умолчанию русский

// Поддерживаемые языки
window.supportedLanguages = window.supportedLanguages || ['ru', 'en'];

// === СЛОВАРЬ ПЕРЕВОДОВ ===
window.translations = window.translations || {
    // Главное меню
    'nav.home': { ru: 'Главная', en: 'Home' },
    'nav.tours': { ru: 'Туры', en: 'Tours' },
    'nav.hotels': { ru: 'Отели', en: 'Hotels' },
    'nav.visa_support': { ru: 'Визовая поддержка', en: 'Visa Support' },
    'nav.tour_agents': { ru: 'Турагентам', en: 'For Tour Agents' },
    'nav.about': { ru: 'О нас', en: 'About Us' },
    'nav.reviews': { ru: 'Отзывы', en: 'Reviews' },
    'nav.blog': { ru: 'Блог', en: 'Blog' },
    'nav.contacts': { ru: 'Контакты', en: 'Contacts' },
    
    // Кнопки и действия
    'btn.book_now': { ru: 'Забронировать', en: 'Book Now' },
    'btn.more_details': { ru: 'Подробнее', en: 'More Details' },
    'btn.view_all': { ru: 'Смотреть все', en: 'View All' },
    'btn.send': { ru: 'Отправить', en: 'Send' },
    'btn.search': { ru: 'Поиск', en: 'Search' },
    'btn.filter': { ru: 'Фильтр', en: 'Filter' },
    'btn.contact_us': { ru: 'Связаться с нами', en: 'Contact Us' },
    
    // Заголовки и подзаголовки
    'title.popular_tours': { ru: 'Популярные туры', en: 'Popular Tours' },
    'title.recommended_tours': { ru: 'Рекомендованные туры по Центральной Азии', en: 'Recommended Central Asia Tours' },
    'title.tajikistan_tours': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours' },
    'title.uzbekistan_tours': { ru: 'Туры по Узбекистану', en: 'Uzbekistan Tours' },
    'title.kyrgyzstan_tours': { ru: 'Туры по Киргизстану', en: 'Kyrgyzstan Tours' },
    'title.turkmenistan_tours': { ru: 'Туры по Туркменистану', en: 'Turkmenistan Tours' },
    'title.tours_by_cities': { ru: 'Туры по городам', en: 'Tours by Cities' },
    'title.find_perfect_tour': { ru: 'Найдите идеальный тур', en: 'Find the Perfect Tour' },
    'title.free_cancellation': { ru: 'Бесплатная отмена', en: 'Free Cancellation' },
    'title.book_now_pay_later': { ru: 'Бронируй сейчас - плати потом', en: 'Book Now - Pay Later' },
    'title.hot_tours': { ru: 'Горящие туры', en: 'Hot Tours' },
    'title.promotions': { ru: 'Акции', en: 'Promotions' },
    'title.search_results': { ru: 'Результаты поиска', en: 'Search Results' },
    'title.our_services': { ru: 'Наши услуги', en: 'Our Services' },
    'title.why_choose_us': { ru: 'Почему выбирают нас', en: 'Why Choose Us' },
    
    // Ценовые обозначения
    'price.from': { ru: 'Цена от:', en: 'Price from:' },
    'price.per_person': { ru: 'за человека', en: 'per person' },
    'price.per_group': { ru: 'за группу', en: 'per group' },
    'price.days': { ru: 'дней', en: 'days' },
    'price.day': { ru: 'день', en: 'day' },
    
    // Формы и поля
    'form.name': { ru: 'Имя', en: 'Name' },
    'form.email': { ru: 'Email', en: 'Email' },
    'form.phone': { ru: 'Телефон', en: 'Phone' },
    'form.message': { ru: 'Сообщение', en: 'Message' },
    'form.check_in': { ru: 'Заезд', en: 'Check-in' },
    'form.check_out': { ru: 'Выезд', en: 'Check-out' },
    'form.guests': { ru: 'Гостей', en: 'Guests' },
    'form.select_country': { ru: 'Выберите страну', en: 'Select Country' },
    'form.select_city': { ru: 'Выберите город', en: 'Select City' },
    'form.select_type': { ru: 'Выберите тип', en: 'Select Type' },
    
    // Услуги
    'service.tours': { ru: 'Туры и экскурсии', en: 'Tours & Excursions' },
    'service.transfer': { ru: 'Трансфер', en: 'Transfer Service' },
    'service.guide': { ru: 'Гид-сопровождение', en: 'Guide Service' },
    'service.agency': { ru: 'Турагентство', en: 'Travel Agency' },
    
    // Подвал сайта
    'footer.contact_info': { ru: 'Контактная информация', en: 'Contact Information' },
    'footer.quick_links': { ru: 'Быстрые ссылки', en: 'Quick Links' },
    'footer.social_media': { ru: 'Социальные сети', en: 'Social Media' },
    'footer.copyright': { ru: '© 2024 Bunyod-Tour. Все права защищены.', en: '© 2024 Bunyod-Tour. All rights reserved.' },
    
    // Фильтры
    'filter.country': { ru: 'Страна', en: 'Country' },
    'filter.city': { ru: 'Город', en: 'City' },
    'filter.tour_type': { ru: 'Тип тура', en: 'Tour Type' },
    'filter.category': { ru: 'Категория', en: 'Category' },
    'filter.date': { ru: 'Дата', en: 'Date' },
    
    // Общие элементы
    'common.loading': { ru: 'Загрузка...', en: 'Loading...' },
    'common.no_results': { ru: 'Результаты не найдены', en: 'No results found' },
    'common.error': { ru: 'Произошла ошибка', en: 'An error occurred' },
    'common.success': { ru: 'Успешно!', en: 'Success!' },
    'common.show_all_tours': { ru: 'Показать все туры', en: 'Show All Tours' },
    'common.clear_search': { ru: 'Очистить поиск', en: 'Clear Search' },
    
    // Placeholders для форм и поиска
    'placeholder.search_tours': { ru: 'Поиск туров...', en: 'Search tours...' },
    'placeholder.select_date': { ru: 'Выберите дату', en: 'Select date' },
    'placeholder.enter_name': { ru: 'Введите ваше имя', en: 'Enter your name' },
    'placeholder.enter_email': { ru: 'Введите email', en: 'Enter email' },
    'placeholder.enter_phone': { ru: 'Введите телефон', en: 'Enter phone' },
    'placeholder.enter_message': { ru: 'Введите сообщение', en: 'Enter message' },
    
    // Title атрибуты (всплывающие подсказки)
    'title.language_switcher': { ru: 'Переключить язык', en: 'Switch language' },
    'title.currency_switcher': { ru: 'Переключить валюту', en: 'Switch currency' },
    'title.search_button': { ru: 'Начать поиск', en: 'Start search' },
    'title.filter_button': { ru: 'Применить фильтры', en: 'Apply filters' },
    'title.book_tour': { ru: 'Забронировать тур', en: 'Book tour' },
    'title.view_details': { ru: 'Посмотреть детали', en: 'View details' },
    
    // АДМИН-ПАНЕЛЬ
    'admin.dashboard': { ru: 'Главная', en: 'Dashboard' },
    'admin.administrator': { ru: 'Администратор', en: 'Administrator' },
    'admin.logout': { ru: 'Выйти', en: 'Logout' },
    'admin.tours': { ru: 'Туры', en: 'Tours' },
    'admin.hotels': { ru: 'Отели', en: 'Hotels' },
    'admin.guides': { ru: 'Гиды', en: 'Guides' },
    'admin.bookings': { ru: 'Заказы', en: 'Bookings' },
    'admin.orders': { ru: 'Заказы', en: 'Orders' },
    'admin.settings': { ru: 'Настройки', en: 'Settings' },
    'admin.translations': { ru: 'Переводы', en: 'Translations' },
    'admin.cms': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.news': { ru: 'Новости', en: 'News' },
    'admin.drivers': { ru: 'Водители', en: 'Drivers' },
    'admin.transfers': { ru: 'Трансферы', en: 'Transfers' },
    'admin.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'admin.countries': { ru: 'Страны', en: 'Countries' },
    'admin.cities': { ru: 'Города', en: 'Cities' },
    'admin.customers': { ru: 'Клиенты', en: 'Customers' },
    'admin.reviews': { ru: 'Отзывы', en: 'Reviews' },
    'admin.payments': { ru: 'Платежи', en: 'Payments' },
    'admin.control_panel': { ru: 'Панель управления', en: 'Control Panel' },
    'admin.admin_panel': { ru: 'Админ-панель', en: 'Admin Panel' },
    'admin.login_message': { ru: 'Войдите в систему управления', en: 'Sign in to the management system' },
    'admin.username': { ru: 'Имя пользователя', en: 'Username' },
    'admin.password': { ru: 'Пароль', en: 'Password' },
    'admin.login_button': { ru: 'Войти в систему', en: 'Sign In' },
    'admin.test_credentials': { ru: 'Тестовые данные: admin / admin123', en: 'Test credentials: admin / admin123' },
    'admin.recent_orders': { ru: 'Последние заказы', en: 'Recent Orders' },
    'admin.active_tours': { ru: 'Активных туров', en: 'Active Tours' },
    'admin.orders_this_month': { ru: 'Заказов за месяц', en: 'Orders This Month' },
    'admin.monthly_revenue': { ru: 'Доход за месяц', en: 'Monthly Revenue' },
    'admin.active_customers': { ru: 'Активных клиентов', en: 'Active Customers' },
    
    // НОВЫЕ КЛЮЧИ ДЛЯ РАСШИРЕННОГО ПОКРЫТИЯ
    'nav.services': { ru: 'Услуги', en: 'Services' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions' },
    'nav.news': { ru: 'Новости', en: 'News' },
    
    // Фильтры и кнопки
    'btn.apply_filters': { ru: 'Применить фильтры', en: 'Apply Filters' },
    'btn.reset_filters': { ru: 'Сбросить все фильтры', en: 'Reset All Filters' },
    
    // Сообщения о поиске
    'common.no_tours_found': { ru: 'Туры не найдены', en: 'No tours found' },
    'common.try_different_search': { ru: 'Попробуйте изменить параметры поиска', en: 'Try changing search parameters' },
    'common.tours_shown': { ru: 'Показано туров:', en: 'Tours shown:' },
    
    // Формы и поля
    'form.date_from': { ru: 'От', en: 'From' },
    'form.date_to': { ru: 'До', en: 'To' },
    
    // Модальные окна
    'modal.tour_details': { ru: 'Детали тура', en: 'Tour Details' },
    'modal.description': { ru: 'Описание тура', en: 'Tour Description' },
    'modal.program': { ru: 'Программа тура', en: 'Tour Program' },
    'modal.hotels': { ru: 'Отели', en: 'Hotels' },
    'modal.features': { ru: 'Особенности тура:', en: 'Tour Features:' }
};

// Убираем const aliases - используем прямые ссылки на window.*

// === ФУНКЦИЯ ПОЛУЧЕНИЯ ПЕРЕВОДА ===
function getTranslation(key, lang = window.currentLanguage) {
    if (window.translations[key] && window.translations[key][lang]) {
        return window.translations[key][lang];
    }
    // Возвращаем русский как fallback
    if (window.translations[key] && window.translations[key]['ru']) {
        return window.translations[key]['ru'];
    }
    // Если перевода вообще нет, возвращаем ключ
    return key;
}

// === ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ===
function switchSiteLanguage(lang) {
    // ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ
    if (!lang || typeof lang !== 'string') {
        console.warn('Недопустимый язык, используем русский по умолчанию');
        lang = 'ru';
    }
    
    if (!window.supportedLanguages.includes(lang)) {
        console.warn(`Неподдерживаемый язык "${lang}", используем русский`);
        lang = 'ru';
    }
    
    // БЕЗОПАСНОЕ СОХРАНЕНИЕ В LOCALSTORAGE
    try {
        localStorage.setItem('selectedLanguage', lang);
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
    
    window.currentLanguage = lang;
    
    // ОБНОВЛЯЕМ ВСЕ ЭЛЕМЕНТЫ ИНТЕРФЕЙСА
    updateLanguageSelector(lang);
    translateStaticInterface(lang);
    
    // ОБНОВЛЯЕМ HTML LANG АТРИБУТ
    document.documentElement.lang = lang;
    
    // ЗАКРЫВАЕМ DROPDOWN БЕЗОПАСНО
    const dropdown = document.getElementById('langDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown) dropdown.classList.remove('show');
    if (arrow) arrow.classList.remove('open');
    
}

// === ОБНОВЛЕНИЕ ПЕРЕКЛЮЧАТЕЛЯ ЯЗЫКОВ ===
function updateLanguageSelector(lang) {
    const languages = {
        'ru': { name: 'Русский', flag: '🇷🇺', flagClass: 'flag-ru', code: 'RU' },
        'en': { name: 'English', flag: '🇺🇸', flagClass: 'flag-us', code: 'EN' }
    };
    
    const selectedLang = languages[lang];
    if (!selectedLang) return;
    
    // Обновляем основную кнопку (обычные страницы)
    const selectedFlag = document.querySelector('.selected-flag');
    const selectedLangText = document.querySelector('.selected-lang');
    
    if (selectedFlag) {
        selectedFlag.textContent = selectedLang.flag;
        selectedFlag.className = `selected-flag ${selectedLang.flagClass}`;
    }
    
    if (selectedLangText) {
        selectedLangText.textContent = selectedLang.name;
    }
    
    // ОБНОВЛЯЕМ ПЕРЕКЛЮЧАТЕЛЬ В АДМИН-ПАНЕЛИ
    const currentLanguageAdmin = document.getElementById('currentLanguageAdmin');
    if (currentLanguageAdmin) {
        currentLanguageAdmin.textContent = selectedLang.code;
    }
    
    // Обновляем активную опцию в dropdown (обычные страницы)
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        }
    });
    
    // Обновляем активную опцию в dropdown админ-панели
    document.querySelectorAll('#languageDropdownAdmin .lang-option, #languageDropdownAdmin a[onclick*="switchAdminLanguage"]').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('onclick') && option.getAttribute('onclick').includes(`'${lang}'`)) {
            option.classList.add('active');
        }
    });
}

// === ИНИЦИАЛИЗАЦИЯ ЯЗЫКА ===
function initializeLanguage() {
    let savedLanguage = 'ru'; // Безопасное значение по умолчанию
    
    // БЕЗОПАСНОЕ ЧТЕНИЕ ИЗ LOCALSTORAGE
    try {
        const stored = localStorage.getItem('selectedLanguage');
        
        // Валидируем сохранённое значение
        if (stored && window.supportedLanguages.includes(stored)) {
            savedLanguage = stored;
        } else {
            console.warn(`Недопустимое значение "${stored}", используем русский по умолчанию`);
            // Исправляем в localStorage
            localStorage.setItem('selectedLanguage', 'ru');
        }
    } catch (error) {
        console.error('Ошибка чтения localStorage:', error);
    }
    
    // УСТАНАВЛИВАЕМ ЯЗЫК
    window.currentLanguage = savedLanguage;
    
    // ОБНОВЛЯЕМ HTML LANG АТРИБУТ
    document.documentElement.lang = savedLanguage;
    
    // ПРИМЕНЯЕМ ПЕРЕВОДЫ И ОБНОВЛЯЕМ ИНТЕРФЕЙС
    updateLanguageSelector(savedLanguage);
    translateStaticInterface(savedLanguage);
}

// === ФУНКЦИЯ ПЕРЕВОДА СТАТИЧЕСКОГО ИНТЕРФЕЙСА ===
function translateStaticInterface(lang) {
    let translatedCount = 0;
    
    // ПЕРЕВОДИМ ОСНОВНОЙ ТЕКСТ (data-translate)
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            // Безопасное обновление текста
            if (element.children.length === 0) {
                element.textContent = translation;
            } else {
                updateTextNodes(element, translation);
            }
            translatedCount++;
        } else {
            console.warn(`Перевод не найден для ключа: ${key}`);
        }
    });
    
    // ПЕРЕВОДИМ PLACEHOLDERS (data-translate-placeholder)
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.placeholder = translation;
            translatedCount++;
        } else {
            console.warn(`Placeholder перевод не найден для ключа: ${key}`);
        }
    });
    
    // ПЕРЕВОДИМ ALT АТРИБУТЫ (data-translate-alt)
    document.querySelectorAll('[data-translate-alt]').forEach(element => {
        const key = element.getAttribute('data-translate-alt');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.alt = translation;
            translatedCount++;
        }
    });
    
    // ПЕРЕВОДИМ TITLE АТРИБУТЫ (data-translate-title)
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.title = translation;
            translatedCount++;
        }
    });
    
    // ПЕРЕВОДИМ VALUE АТРИБУТЫ (data-translate-value)
    document.querySelectorAll('[data-translate-value]').forEach(element => {
        const key = element.getAttribute('data-translate-value');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.value = translation;
            translatedCount++;
        }
    });
    
}

// === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ТЕКСТОВЫХ УЗЛОВ ===
function updateTextNodes(element, newText) {
    for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = newText;
            return; // Обновляем только первый найденный текстовый узел
        }
    }
    // Если текстовых узлов не найдено, создаем новый
    if (element.children.length === 0) {
        element.textContent = newText;
    }
}

// === ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ DROPDOWN ЯЗЫКОВ ===
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown) dropdown.classList.toggle('show');
    if (arrow) arrow.classList.toggle('open');
}

// === БЕЗОПАСНАЯ ФУНКЦИЯ ЭКРАНИРОВАНИЯ HTML ===
function escapeHTML(unsafe) {
    if (typeof unsafe !== 'string') {
        unsafe = String(unsafe || '');
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// === БЕЗОПАСНАЯ ФУНКЦИЯ ЭКРАНИРОВАНИЯ ДЛЯ DATA-АТРИБУТОВ ===
function escapeDataAttribute(unsafe) {
    if (typeof unsafe !== 'string') {
        unsafe = String(unsafe || '');
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// === АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
});

// === ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ ===
window.i18n = {
    supportedLanguages: window.supportedLanguages,
    currentLanguage: () => window.currentLanguage,
    initializeLanguage,
    switchSiteLanguage,
    translateStaticInterface,
    getTranslation,
    toggleLanguageDropdown,
    updateLanguageSelector,
    // Безопасные функции экранирования
    escapeHTML,
    escapeDataAttribute
};

// === ЭКСПОРТ ФУНКЦИЙ ЭКРАНИРОВАНИЯ ===
window.escapeHTML = escapeHTML;
window.escapeDataAttribute = escapeDataAttribute;

// === ГЛОБАЛЬНЫЕ HELPER ФУНКЦИИ ДЛЯ ДИНАМИЧЕСКОГО КОНТЕНТА (БЕЗОПАСНЫЕ) ===
window.getTitleByLanguage = function(titleObject, lang) {
    try {
        const title = typeof titleObject === 'string' ? JSON.parse(titleObject) : titleObject;
        const result = title[lang] || title.ru || title.en || 'Название не указано';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(titleObject || 'Название не указано');
    }
};

window.getDescriptionByLanguage = function(descriptionObject, lang) {
    try {
        const description = typeof descriptionObject === 'string' ? JSON.parse(descriptionObject) : descriptionObject;
        const result = description[lang] || description.ru || description.en || 'Описание не указано';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(descriptionObject || 'Описание не указано');
    }
};

window.getCategoryNameByLanguage = function(categoryObject, lang) {
    try {
        const category = typeof categoryObject === 'string' ? JSON.parse(categoryObject) : categoryObject;
        const result = category[lang] || category.ru || category.en || 'Категория';
        return escapeHTML(result);
    } catch (e) {
        return escapeHTML(categoryObject || 'Категория');
    }
};

// === НЕБЕЗОПАСНЫЕ ВЕРСИИ ДЛЯ ОСОБЫХ СЛУЧАЕВ (ИСПОЛЬЗОВАТЬ ОСТОРОЖНО) ===
window.getTitleByLanguageRaw = function(titleObject, lang) {
    try {
        const title = typeof titleObject === 'string' ? JSON.parse(titleObject) : titleObject;
        return title[lang] || title.ru || title.en || 'Название не указано';
    } catch (e) {
        return titleObject || 'Название не указано';
    }
};

window.getDescriptionByLanguageRaw = function(descriptionObject, lang) {
    try {
        const description = typeof descriptionObject === 'string' ? JSON.parse(descriptionObject) : descriptionObject;
        return description[lang] || description.ru || description.en || 'Описание не указано';
    } catch (e) {
        return descriptionObject || 'Описание не указано';
    }
};

window.getCategoryNameByLanguageRaw = function(categoryObject, lang) {
    try {
        const category = typeof categoryObject === 'string' ? JSON.parse(categoryObject) : categoryObject;
        return category[lang] || category.ru || category.en || 'Категория';
    } catch (e) {
        return categoryObject || 'Категория';
    }
};


})(); // Закрываем IIFE