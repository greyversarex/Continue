// === ЦЕНТРАЛЬНАЯ СИСТЕМА ИНТЕРНАЦИОНАЛИЗАЦИИ ===
// Используется на всех страницах сайта для трехъязычной поддержки (EN/RU/TJ)

// === ЗАЩИТА ОТ ДВОЙНОЙ ЗАГРУЗКИ ===
(function() {
if (window.bunyodTourI18nLoaded) {
    return; // Просто выходим из IIFE без ошибки
}

// Помечаем что система загружена в самом начале
window.bunyodTourI18nLoaded = true;

// Глобальная переменная для текущего языка
window.currentLanguage = window.currentLanguage || 'en'; // По умолчанию английский

// Поддерживаемые языки
window.supportedLanguages = window.supportedLanguages || ['en', 'ru', 'tj'];

// === СЛОВАРЬ ПЕРЕВОДОВ ===
window.translations = window.translations || {
    // Главное меню
    'nav.home': { ru: 'Главная', en: 'Home', tj: 'Асосӣ' },
    'nav.tours': { ru: 'Туры', en: 'Tours', tj: 'Сайёҳатҳо' },
    'nav.hotels': { ru: 'Отели', en: 'Hotels', tj: 'Меҳмонхонаҳо' },
    'nav.visa_support': { ru: 'Визовая поддержка', en: 'Visa Support', tj: 'Дастгирии виза' },
    'nav.tour_agents': { ru: 'Турагентам', en: 'For Tour Agents', tj: 'Барои туроператорҳо' },
    'nav.about': { ru: 'О нас', en: 'About Us', tj: 'Дар бораи мо' },
    'nav.reviews': { ru: 'Отзывы', en: 'Reviews', tj: 'Мулоҷзаҳо' },
    'nav.blog': { ru: 'Блог', en: 'Blog', tj: 'Блог' },
    'nav.contacts': { ru: 'Контакты', en: 'Contacts', tj: 'Тамосҳо' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer', tj: 'Интиқол' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides', tj: 'Роҳбарони сайёҳӣ' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour', tj: 'Фармоиши сафар' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists', tj: 'Барои сайёҳон' },
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide', tj: 'Дастури сайт' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes', tj: 'Эзоҳҳои махсус' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement', tj: 'Шартномаи пешниҳод' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules', tj: 'Қоидаҳои пардохт ва баргардонидани маблағ' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions', tj: 'Акцияҳо' },
    'nav.news': { ru: 'Новости', en: 'News', tj: 'Хабарҳо' },
    'nav.for_agents': { ru: 'Для турагентов', en: 'For Tour Agents', tj: 'Барои турагентҳо' },
    'nav.our_agents': { ru: 'Наши турагенты', en: 'Our Tour Agents', tj: 'Турагентҳои мо' },
    
    // Кнопки и действия
    'btn.book_now': { ru: 'Забронировать', en: 'Book Now', tj: 'Захира кардан' },
    'btn.more_details': { ru: 'Подробнее', en: 'More Details', tj: 'Муфассал' },
    'btn.view_all': { ru: 'Смотреть все', en: 'View All', tj: 'Ҳамаро дидан' },
    'btn.send': { ru: 'Отправить', en: 'Send', tj: 'Фиристодан' },
    'btn.search': { ru: 'Поиск', en: 'Search', tj: 'Ҷустуҷӯ' },
    'btn.filter': { ru: 'Фильтр', en: 'Filter', tj: 'Филтр' },
    'btn.contact_us': { ru: 'Связаться с нами', en: 'Contact Us', tj: 'Бо мо тамос гиред' },
    
    // Заголовки и подзаголовки
    'title.popular_tours': { ru: 'Популярные туры', en: 'Popular Tours', tj: 'Сайёҳатҳои машҳур' },
    'title.recommended_tours': { ru: 'Рекомендованные туры по Центральной Азии', en: 'Recommended Central Asia Tours', tj: 'Сайёҳатҳои тавсияшуда дар Осиёи Марказӣ' },
    'title.tajikistan_tours': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours', tj: 'Сайёҳатҳо дар Тоҷикистон' },
    'title.uzbekistan_tours': { ru: 'Туры по Узбекистану', en: 'Uzbekistan Tours', tj: 'Сайёҳатҳо дар Ӯзбакистон' },
    'title.kyrgyzstan_tours': { ru: 'Туры по Киргизстану', en: 'Kyrgyzstan Tours', tj: 'Сайёҳатҳо дар Қирғизистон' },
    'title.turkmenistan_tours': { ru: 'Туры по Туркменистану', en: 'Turkmenistan Tours', tj: 'Сайёҳатҳо дар Туркманистон' },
    'title.tours_by_cities': { ru: 'Туры по городам', en: 'Tours by Cities', tj: 'Сайёҳатҳо дар шаҳрҳо' },
    'title.find_perfect_tour': { ru: 'Найдите идеальный тур', en: 'Find the Perfect Tour', tj: 'Сайёҳати мукаммалро ёбед' },
    'title.free_cancellation': { ru: 'Бесплатная отмена', en: 'Free Cancellation', tj: 'Лағви ройгон' },
    'title.book_now_pay_later': { ru: 'Бронируй сейчас - плати потом', en: 'Book Now - Pay Later', tj: 'Акнун захира - баъдан пардохт' },
    'title.hot_tours': { ru: 'Горящие туры', en: 'Hot Tours', tj: 'Сайёҳатҳои доғ' },
    'title.promotions': { ru: 'Акции', en: 'Promotions', tj: 'Аксияҳо' },
    'title.search_results': { ru: 'Результаты поиска', en: 'Search Results', tj: 'Натиҷаҳои ҷустуҷӯ' },
    'title.our_services': { ru: 'Наши услуги', en: 'Our Services', tj: 'Хидматҳои мо' },
    'title.why_choose_us': { ru: 'Почему выбирают нас', en: 'Why Choose Us', tj: 'Чаро моро интихоб мекунанд' },
    
    // Ценовые обозначения
    'price.from': { ru: 'Цена от:', en: 'Price from:', tj: 'Нарх аз:' },
    'price.per_person': { ru: 'за человека', en: 'per person', tj: 'барои шахс' },
    'price.per_group': { ru: 'за группу', en: 'per group', tj: 'барои гурӯҳ' },
    'price.days': { ru: 'дней', en: 'days', tj: 'рӯзҳо' },
    'price.day': { ru: 'день', en: 'day', tj: 'рӯз' },
    
    // Формы и поля
    'form.name': { ru: 'Имя', en: 'Name', tj: 'Ном' },
    'form.email': { ru: 'Email', en: 'Email', tj: 'Почтаи электронӣ' },
    'form.phone': { ru: 'Телефон', en: 'Phone', tj: 'Телефон' },
    'form.message': { ru: 'Сообщение', en: 'Message', tj: 'Паём' },
    'form.check_in': { ru: 'Заезд', en: 'Check-in', tj: 'Даромадан' },
    'form.check_out': { ru: 'Выезд', en: 'Check-out', tj: 'Баромадан' },
    'form.guests': { ru: 'Гостей', en: 'Guests', tj: 'Меҳмонҳо' },
    'form.select_country': { ru: 'Выберите страну', en: 'Select Country', tj: 'Кишварро интихоб кунед' },
    'form.select_city': { ru: 'Выберите город', en: 'Select City', tj: 'Шаҳрро интихоб кунед' },
    'form.select_type': { ru: 'Выберите тип', en: 'Select Type', tj: 'Навро интихоб кунед' },
    
    // Услуги и заголовки секций
    'service.tours': { ru: 'Туры и экскурсии', en: 'Tours & Excursions', tj: 'Сайёҳатҳо ва экскурсияҳо' },
    'service.transfer': { ru: 'Трансфер', en: 'Transfer Service', tj: 'Хидмати интиқол' },
    'service.guide': { ru: 'Гид-сопровождение', en: 'Guide Service', tj: 'Роҳнамоии сайёҳӣ' },
    'service.agency': { ru: 'Турагентство', en: 'Travel Agency', tj: 'Ажонсии сайёҳӣ' },
    'service.transfer_title': { ru: 'ТРАНСФЕР', en: 'TRANSFER', tj: 'ИНТИҚОЛ' },
    'service.guides_title': { ru: 'ТУР-ГИДЫ', en: 'TOUR GUIDES', tj: 'РОҲНАМОЁНИ САЙЁҲӢ' },
    'service.agency_title': { ru: 'АГЕНТСКИЙ СЕРВИС', en: 'AGENCY SERVICE', tj: 'ХИДМАТҲОИ АГЕНТӢ' },
    'service.custom_tour_title': { ru: 'СОБСТВЕННЫЙ ТУР', en: 'CUSTOM TOUR', tj: 'САЙЁҲАТИ МАХСУС' },
    
    // Подвал сайта
    'footer.contact_info': { ru: 'Контактная информация', en: 'Contact Information', tj: 'Маълумоти тамос' },
    'footer.quick_links': { ru: 'Быстрые ссылки', en: 'Quick Links', tj: 'Пайвандҳои тез' },
    'footer.social_media': { ru: 'Социальные сети', en: 'Social Media', tj: 'Шабакаҳои иҷтимоӣ' },
    'footer.our_location': { ru: 'Наше местоположение:', en: 'Our Location:', tj: 'Макони мо:' },
    'footer.copyright': { ru: '© 2024 Bunyod-Tour. Все права защищены.', en: '© 2024 Bunyod-Tour. All rights reserved.', tj: '© 2024 Bunyod-Tour. Ҳамаи ҳуқуқ ҳифз шудаанд.' },
    
    // Фильтры
    'filters.title': { ru: 'Фильтры поиска', en: 'Search Filters', tj: 'Филтрҳои ҷустуҷӯ' },
    'filters.destination': { ru: 'Направление', en: 'Destination', tj: 'Ҷиҳат' },
    'filter.country': { ru: 'Страна', en: 'Country', tj: 'Кишвар' },
    'filter.city': { ru: 'Город', en: 'City', tj: 'Шаҳр' },
    'filter.tour_type': { ru: 'Тип тура', en: 'Tour Type', tj: 'Нави сайёҳат' },
    'filter.category': { ru: 'Категория', en: 'Category', tj: 'Категория' },
    'filter.date': { ru: 'Дата', en: 'Date', tj: 'Сана' },
    
    // Формы
    'form.country': { ru: 'Страна', en: 'Country', tj: 'Кишвар' },
    
    // Страны  
    'country.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan', tj: 'Тоҷикистон' },
    'country.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan', tj: 'Ӯзбакистон' },
    'country.kyrgyzstan': { ru: 'Киргизстан', en: 'Kyrgyzstan', tj: 'Қирғизистон' },
    'country.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan', tj: 'Туркманистон' },
    
    // Общие элементы
    'common.loading': { ru: 'Загрузка...', en: 'Loading...', tj: 'Боргирӣ мешавад...' },
    'common.no_results': { ru: 'Результаты не найдены', en: 'No results found', tj: 'Натиҷаҳо ёфт нашуданд' },
    'common.error': { ru: 'Произошла ошибка', en: 'An error occurred', tj: 'Хато рӯх дод' },
    'common.success': { ru: 'Успешно!', en: 'Success!', tj: 'Муваффақият!' },
    'common.show_all_tours': { ru: 'Показать все туры', en: 'Show All Tours', tj: 'Ҳамаи сайёҳатҳоро нишон додан' },
    'common.clear_search': { ru: 'Очистить поиск', en: 'Clear Search', tj: 'Ҷустуҷӯро пок кардан' },
    'common.save': { ru: 'Сохранить', en: 'Save', tj: 'Захира кардан' },
    'common.cancel': { ru: 'Отмена', en: 'Cancel', tj: 'Лағв кардан' },
    'common.edit': { ru: 'Редактировать', en: 'Edit', tj: 'Ислоҳ кардан' },
    'common.delete': { ru: 'Удалить', en: 'Delete', tj: 'Ҳазф кардан' },
    'common.add': { ru: 'Добавить', en: 'Add', tj: 'Илова кардан' },
    'common.create': { ru: 'Создать', en: 'Create', tj: 'Эҷод кардан' },
    
    // Placeholders для форм и поиска
    'placeholder.search_tours': { ru: 'Поиск туров...', en: 'Search tours...', tj: 'Ҷустуҷӯи сайёҳатҳо...' },
    'placeholder.search_perfect_tour': { ru: 'Найдите идеальный тур: Памир, Искандеркуль, треккинг...', en: 'Find the perfect tour: Pamir, Iskanderkul, trekking...', tj: 'Сайёҳати мукаммалро ёбед: Помир, Искандаркӯл, кӯҳнавардӣ...' },
    'placeholder.select_date': { ru: 'Выберите дату', en: 'Select date', tj: 'Санаро интихоб кунед' },
    'placeholder.enter_name': { ru: 'Введите ваше имя', en: 'Enter your name', tj: 'Номи худро ворид кунед' },
    'placeholder.enter_email': { ru: 'Введите email', en: 'Enter email', tj: 'Почтаи электронӣ ворид кунед' },
    'placeholder.enter_phone': { ru: 'Введите телефон', en: 'Enter phone', tj: 'Рақами телефон ворид кунед' },
    'placeholder.enter_message': { ru: 'Введите сообщение', en: 'Enter message', tj: 'Паёми худро ворид кунед' },

    // === ЗАГОЛОВКИ СТРАНИЦ ===
    'page.title': { ru: 'Bunyod-Tour - Туры по Таджикистану', en: 'Bunyod-Tour - Tours in Tajikistan', tj: 'Bunyod-Tour - Сайёҳатҳо дар Тоҷикистон' },
    'hotel.page_title': { ru: 'Каталог отелей - Bunyod-Tour', en: 'Hotels Catalog - Bunyod-Tour', tj: 'Каталоги меҳмонхонаҳо - Bunyod-Tour' },
    'tours.page_title': { ru: 'Поиск туров - Bunyod-Tour', en: 'Search Tours - Bunyod-Tour', tj: 'Ҷустуҷӯи сайёҳатҳо - Bunyod-Tour' },
    'tour.page_title': { ru: 'Тур - Bunyod-Tour', en: 'Tour - Bunyod-Tour', tj: 'Сайёҳат - Bunyod-Tour' },
    'hotel.catalog_title': { ru: 'Каталог отелей', en: 'Hotels Catalog' },
    'hotel.catalog_description': { ru: 'Найдите идеальное размещение для вашего путешествия по Центральной Азии', en: 'Find the perfect accommodation for your Central Asia journey' },
    
    // Категории отелей
    'hotel.category_luxury': { ru: 'Люкс', en: 'Luxury' },
    'hotel.category_premium': { ru: 'Премиум', en: 'Premium' },
    'hotel.category_budget': { ru: 'Бюджетный', en: 'Budget' },
    
    // Поиск и сообщения отелей
    'hotel.search_placeholder': { ru: 'Название отеля...', en: 'Hotel name...' },
    'hotel.no_hotels_found': { ru: 'Отели не найдены', en: 'No hotels found' },
    'hotel.try_different_filters': { ru: 'Попробуйте изменить фильтры поиска', en: 'Try adjusting your search filters' },
    
    // Фильтры отелей
    'filters.country': { ru: 'Страна', en: 'Country' },
    'filters.all_countries': { ru: 'Все страны', en: 'All Countries' },
    'filters.category': { ru: 'Категория', en: 'Category' },
    'filters.all_categories': { ru: 'Все категории', en: 'All Categories' },
    'filters.stars': { ru: 'Звезды', en: 'Stars' },
    'filters.any_stars': { ru: 'Любое количество', en: 'Any Rating' },
    'filters.five_stars': { ru: '5 звезд', en: '5 Stars' },
    'filters.four_stars': { ru: '4 звезды', en: '4 Stars' },
    'filters.three_stars': { ru: '3 звезды', en: '3 Stars' },
    'filters.two_stars': { ru: '2 звезды', en: '2 Stars' },
    'filters.one_star': { ru: '1 звезда', en: '1 Star' },
    'filters.search': { ru: 'Поиск', en: 'Search' },
    
    // Кнопки каталога отелей
    'btn.clear_filters': { ru: 'Очистить фильтры', en: 'Clear Filters', tj: 'Филтрҳоро тоза кунед' },
    
    // Страны Центральной Азии
    'country.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan', tj: 'Ӯзбакистон' },
    'country.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan', tj: 'Тоҷикистон' },
    'country.kyrgyzstan': { ru: 'Киргизстан', en: 'Kyrgyzstan', tj: 'Қирғизистон' },
    'country.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan', tj: 'Туркманистон' },
    'country.kazakhstan': { ru: 'Казахстан', en: 'Kazakhstan', tj: 'Қазоқистон' },

    // Города Центральной Азии
    'city.dushanbe': { ru: 'Душанбе', en: 'Dushanbe', tj: 'Душанбе' },
    'city.khorog': { ru: 'Хорог', en: 'Khorog', tj: 'Хоруғ' },
    'city.khujand': { ru: 'Худжанд', en: 'Khujand', tj: 'Хуҷанд' },
    'city.tashkent': { ru: 'Ташкент', en: 'Tashkent', tj: 'Тошканд' },
    'city.samarkand': { ru: 'Самарканд', en: 'Samarkand', tj: 'Самарқанд' },
    'city.bukhara': { ru: 'Бухара', en: 'Bukhara', tj: 'Бухоро' },
    'city.bishkek': { ru: 'Бишкек', en: 'Bishkek', tj: 'Бишкак' },
    'city.astana': { ru: 'Астана', en: 'Astana', tj: 'Астана' },
    'city.almaty': { ru: 'Алматы', en: 'Almaty', tj: 'Алматӣ' },
    'city.ashgabat': { ru: 'Ашхабад', en: 'Ashgabat', tj: 'Ошхобод' },
    
    // Расширенная навигация и услуги
    'nav.services': { ru: 'Услуги', en: 'Services', tj: 'Хидматҳо' },
    'nav.guides': { ru: 'Тургиды', en: 'Tour Guides', tj: 'Роҳнамои сайёҳӣ' },
    'nav.transfer': { ru: 'Трансфер', en: 'Transfer', tj: 'Интиқол' },
    'nav.book_tour': { ru: 'Заказ тура', en: 'Book Tour', tj: 'Фармоиши сайёҳат' },
    'nav.tourists': { ru: 'Туристам', en: 'For Tourists', tj: 'Барои туристҳо' },
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide', tj: 'Дастурамали сомона' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes', tj: 'Қайдҳои махсус' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement', tj: 'Шартнома-оферта' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules', tj: 'Қоидаҳои пардохт ва баргардонидани маблағ' },
    'nav.promotions': { ru: 'Акции', en: 'Promotions', tj: 'Аксияҳо' },
    'nav.news': { ru: 'Новости', en: 'News', tj: 'Ахборот' },
    'nav.for_agents': { ru: 'Тур-агентам', en: 'For Tour Agents', tj: 'Барои агентҳои сайёҳӣ' },
    
    // Типы туров по категориям
    'tour.single_day': { ru: 'Однодневные', en: 'Single Day', tj: 'Якрӯза' },
    'tour.multi_day': { ru: 'Многодневные', en: 'Multi-Day', tj: 'Чандрӯза' },
    'tour.excursions': { ru: 'Экскурсии', en: 'Excursions', tj: 'Экскурсияҳо' },
    'tour.city_tours': { ru: 'Городские туры', en: 'City Tours', tj: 'Сайёҳатҳои шаҳрӣ' },
    'tour.nature_eco': { ru: 'Природа/экологические туры', en: 'Nature/Eco Tours', tj: 'Табиат/эколого сайёҳатҳо' },
    'tour.cultural': { ru: 'Культурно познавательные туры', en: 'Cultural Tours', tj: 'Сайёҳатҳои фарҳангӣ-маърифатӣ' },
    'tour.historical': { ru: 'Исторические туры', en: 'Historical Tours', tj: 'Сайёҳатҳои таърихӣ' },
    'tour.trekking': { ru: 'Походы/трекинги', en: 'Trekking/Hiking', tj: 'Кӯҳнавардӣ/пиёдаравӣ' },
    'tour.mountain_landscapes': { ru: 'Горные ландшафты', en: 'Mountain Landscapes', tj: 'Манзараҳои кӯҳӣ' },
    'tour.lake_landscapes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes', tj: 'Манзараҳои кӯлӣ' },
    'tour.adventure': { ru: 'Приключенческие туры', en: 'Adventure Tours', tj: 'Сайёҳатҳои сарназар' },
    'tour.gastronomy': { ru: 'Гастрономические туры', en: 'Culinary Tours', tj: 'Сайёҳатҳои ошпазӣ' },
    'tour.auto_safari': { ru: 'Автотуры/сафари/джип-туры', en: 'Auto Tours/Safari/Jeep Tours', tj: 'Авто сайёҳатҳо/сафарӣ/ҷип-сайёҳатҳо' },
    'tour.agro': { ru: 'Агротуры', en: 'Agro Tours', tj: 'Агросайёҳатҳо' },
    'tour.vip': { ru: 'VIP туры', en: 'VIP Tours', tj: 'VIP сайёҳатҳо' },

    // Типы туров по формату
    'tour_type.personal': { ru: 'Персональный', en: 'Personal', tj: 'Шахсӣ' },
    'tour_type.group_personal': { ru: 'Групповой персональный', en: 'Group Personal', tj: 'Гурӯҳии шахсӣ' },
    'tour_type.group_general': { ru: 'Групповой общий', en: 'Group General', tj: 'Гурӯҳии умумӣ' },
    'tour_type.special': { ru: 'Специальный', en: 'Special', tj: 'Махсус' },
    
    // Расширенный футер
    'footer.company': { ru: 'Компания:', en: 'Company:' },
    'footer.partners': { ru: 'Партнеры', en: 'Partners' },
    'footer.investment_projects': { ru: 'Инвестиционные Проекты', en: 'Investment Projects' },
    'footer.how_to_book': { ru: 'Как бронировать туры?', en: 'How to Book Tours?' },
    'footer.tours_catalog': { ru: 'Каталог туров', en: 'Tours Catalog' },
    'footer.hotels_catalog': { ru: 'Каталог отелей', en: 'Hotels Catalog' },
    'footer.social_pages': { ru: 'Социальные страницы:', en: 'Social Pages:' },
    'footer.license_info': { ru: 'Лицензия на туристическую деятельность ФС№ 0000253, от 25.10.2022 г.', en: 'Tourist Activity License FS№ 0000253, dated 25.10.2022' },
    'footer.contacts': { ru: 'Контакты:', en: 'Contacts:' },
    'footer.public_offer': { ru: 'Публичная Оферта-Договор', en: 'Public Offer Agreement' },
    'footer.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'footer.privacy_policy': { ru: 'Политика конфиденциальности', en: 'Privacy Policy' },
    'footer.company_info': { ru: 'Все права защищены | ООО "Бунёд-Тур" (2017-2025) | ИНН: 010098739; ОГРН: 0110023137', en: 'All rights reserved | Bunyod-Tour LLC (2017-2025) | TIN: 010098739; OGRN: 0110023137', tj: 'Ҳамаи ҳуқуқ ҳифз шудаанд | ҶМА "Бунёд-Тур" (2017-2025) | ИНН: 010098739; ОГРН: 0110023137' },
    
    // Селектор языка
    'language.russian': { ru: 'Русский', en: 'Russian', tj: 'Русӣ' },
    'language.english': { ru: 'English', en: 'English', tj: 'Англисӣ' },
    'language.tajik': { ru: 'Таджикский', en: 'Tajik', tj: 'Тоҷикӣ' },
    
    // Дополнительные языки (для совместимости)
    'lang.russian': { ru: 'Русский', en: 'Russian', tj: 'Русӣ' },
    'lang.english': { ru: 'English', en: 'English', tj: 'Англисӣ' },
    'lang.tajik': { ru: 'Таджикский', en: 'Tajik', tj: 'Тоҷикӣ' },
    
    // НОВЫЕ PLACEHOLDER'Ы ДЛЯ АДМИН-ПАНЕЛИ
    'placeholder.search_hotels': { ru: 'Поиск отелей...', en: 'Search hotels...' },
    'placeholder.search_tour_agents': { ru: 'Поиск турагентов...', en: 'Search tour agents...' },
    'placeholder.enter_text_for_translation': { ru: 'Введите текст для перевода...', en: 'Enter text for translation...' },
    'placeholder.translated_text_will_appear': { ru: 'Переведенный текст появится здесь...', en: 'Translated text will appear here...' },
    'placeholder.service_name_example': { ru: 'Например: Обед в ресторане', en: 'For example: Restaurant lunch' },
    'placeholder.component_additional_info': { ru: 'Дополнительная информация о компоненте', en: 'Additional component information' },
    'placeholder.slide_title': { ru: 'Заголовок слайда', en: 'Slide title' },
    'placeholder.slide_description': { ru: 'Описание слайда', en: 'Slide description' },
    'placeholder.learn_more': { ru: 'Узнать больше', en: 'Learn more' },
    'placeholder.hotel_name_example': { ru: 'Отель Хилтон Душанбе, Серена Отель и т.д.', en: 'Hilton Dushanbe, Serena Hotel, etc.' },
    'placeholder.hotel_description_ru': { ru: 'Краткое описание отеля, расположения и особенностей на русском языке...', en: 'Brief hotel description, location and features in Russian...' },
    'placeholder.enter_new_brand': { ru: 'Введите название нового бренда', en: 'Enter new brand name' },
    'placeholder.city_examples': { ru: 'Душанбе, Самарканд, Бишкек и т.д.', en: 'Dushanbe, Samarkand, Bishkek, etc.' },
    'placeholder.enter_new_amenity': { ru: 'Введите название нового удобства', en: 'Enter new amenity name' },
    'placeholder.meeting_with_guide': { ru: 'Встреча с гидом', en: 'Meeting with guide' },
    'placeholder.detailed_stage_description': { ru: 'Подробное описание этапа программы', en: 'Detailed stage description' },
    'placeholder.pickup_info_example': { ru: 'Например: Приём включён, Место сбора: отель, и т.д.', en: 'For example: Pickup included, Meeting point: hotel, etc.' },
    'placeholder.enter_service_name': { ru: 'Введите название услуги', en: 'Enter service name' },
    'placeholder.news_brief_description': { ru: 'Краткое описание новости (optional)', en: 'Brief news description (optional)' },
    
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
    
    // НОВЫЕ АДМИНИСТРАТИВНЫЕ РАЗДЕЛЫ
    'admin.price_calculator': { ru: 'Калькулятор цен', en: 'Price Calculator' },
    'admin.banner_management': { ru: 'Управление баннером', en: 'Banner Management' },
    'admin.tour_agents': { ru: 'Турагенты', en: 'Tour Agents' },
    'admin.trips': { ru: 'Поездки', en: 'Trips' },
    'admin.exchange_rates': { ru: 'Курсы валют', en: 'Exchange Rates' },
    'admin.cms_content': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.sales_chart': { ru: 'График продаж', en: 'Sales Chart' },
    'admin.popular_destinations': { ru: 'Популярные направления', en: 'Popular Destinations' },
    'admin.manage_hotels': { ru: 'Управление отелями', en: 'Hotel Management' },
    'admin.manage_guides': { ru: 'Управление гидами', en: 'Guide Management' },
    'admin.manage_tour_agents': { ru: 'Управление турагентами', en: 'Tour Agent Management' },
    'admin.manage_drivers': { ru: 'Управление водителями', en: 'Driver Management' },
    'admin.manage_trips': { ru: 'Управление поездками', en: 'Trip Management' },
    'admin.transfer_requests': { ru: 'Заявки на трансфер', en: 'Transfer Requests' },
    'admin.manage_countries': { ru: 'Управление странами', en: 'Country Management' },
    'admin.manage_cities': { ru: 'Управление городами', en: 'City Management' },
    'admin.total_views': { ru: 'Всего просмотров', en: 'Total Views' },
    'admin.total_news': { ru: 'Всего новостей', en: 'Total News' },
    'admin.published': { ru: 'Опубликовано', en: 'Published' },
    'admin.drafts': { ru: 'Черновики', en: 'Drafts' },
    'admin.tour_blocks': { ru: 'Блоки туров', en: 'Tour Blocks' },
    'admin.site_settings': { ru: 'Настройки сайта', en: 'Site Settings' },
    'admin.tour_form': { ru: 'Форма тура', en: 'Tour Form' },
    'admin.manage_tour_blocks': { ru: 'Управление блоками туров', en: 'Tour Block Management' },
    
    // ТАБЛИЦЫ
    'table.order_number': { ru: 'Номер заказа', en: 'Order #' },
    'table.client': { ru: 'Клиент', en: 'Client' },
    'table.tour': { ru: 'Тур', en: 'Tour' },
    'table.date': { ru: 'Дата', en: 'Date' },
    'table.amount': { ru: 'Сумма', en: 'Amount' },
    'table.status': { ru: 'Статус', en: 'Status' },
    'table.actions': { ru: 'Действия', en: 'Actions' },
    'table.name': { ru: 'Название', en: 'Name' },
    'table.category': { ru: 'Категория', en: 'Category' },
    'table.country': { ru: 'Страна', en: 'Country' },
    'table.city': { ru: 'Город', en: 'City' },
    'table.duration': { ru: 'Длительность', en: 'Duration' },
    'table.price': { ru: 'Цена', en: 'Price' },
    'table.title': { ru: 'Заголовок', en: 'Title' },
    'table.author': { ru: 'Автор', en: 'Author' },
    'table.publish_date': { ru: 'Дата публикации', en: 'Publish Date' },
    'table.views': { ru: 'Просмотры', en: 'Views' },
    'table.block_name_ru': { ru: 'Название блока (RU)', en: 'Block Name (RU)' },
    'table.block_name_en': { ru: 'Название блока (EN)', en: 'Block Name (EN)' },
    'table.slug': { ru: 'URL-адрес', en: 'Slug' },
    'table.tour_count': { ru: 'Количество туров', en: 'Tour Count' },
    'table.order': { ru: 'Порядок', en: 'Order' },
    
    // КНОПКИ
    'btn.add_tour': { ru: 'Добавить тур', en: 'Add Tour' },
    'btn.create_tour_block': { ru: 'Создать блок туров', en: 'Create Tour Block' },
    'btn.add_hotel': { ru: 'Добавить отель', en: 'Add Hotel' },
    'btn.add_guide': { ru: 'Добавить гида', en: 'Add Guide' },
    'btn.add_tour_agent': { ru: 'Добавить турагента', en: 'Add Tour Agent' },
    'btn.add_driver': { ru: 'Добавить водителя', en: 'Add Driver' },
    'btn.add_trip': { ru: 'Добавить поездку', en: 'Add Trip' },
    'btn.add_country': { ru: 'Добавить страну', en: 'Add Country' },
    'btn.add_city': { ru: 'Добавить город', en: 'Add City' },
    
    // СТАТУСЫ
    'status.pending': { ru: 'Ожидание', en: 'Pending' },
    'status.confirmed': { ru: 'Подтвержден', en: 'Confirmed' },
    'status.paid': { ru: 'Оплачен', en: 'Paid' },
    'status.completed': { ru: 'Завершен', en: 'Completed' },
    'status.cancelled': { ru: 'Отменен', en: 'Cancelled' },
    
    // ТАБЫ
    'tab.all_orders': { ru: 'Все заказы', en: 'All Orders' },
    
    // ФОРМЫ
    'form.pickup_info': { ru: 'Информация о встрече/трансфере', en: 'Pickup/Meeting Information' },
    'form.tour_languages': { ru: 'Языки тура', en: 'Tour Languages' },
    'form.min_people': { ru: 'Минимальное количество людей', en: 'Minimum Number of People' },
    'form.max_people': { ru: 'Максимальное количество людей', en: 'Maximum Number of People' },
    'form.available_months': { ru: 'Доступные месяцы', en: 'Available Months' },
    'form.available_days': { ru: 'Доступные дни', en: 'Available Days' },
    'form.tour_photos': { ru: 'Фотографии тура', en: 'Tour Photos' },
    
    // ЯЗЫКИ
    'language.russian': { ru: 'Русский', en: 'Russian' },
    
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
    'modal.features': { ru: 'Особенности тура:', en: 'Tour Features:' },
    
    // === НОВЫЕ КЛЮЧИ ДЛЯ index.html ===
    
    // Заголовок страницы
    'page.title': { ru: 'Bunyod-Tour - Туры по Таджикистану', en: 'Bunyod-Tour - Tours in Tajikistan' },

    // Дополнительная навигация
    'nav.site_guide': { ru: 'Инструкция сайта', en: 'Site Guide' },
    'nav.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.offer_agreement': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    'nav.our_agents': { ru: 'Наши турагенты', en: 'Our Travel Agents' },
    'nav.for_agents': { ru: 'Для турагентов', en: 'For Travel Agents' },

    // Типы туров в навигации
    'tour.single_day': { ru: 'Однодневные', en: 'Single Day' },
    'tour.multi_day': { ru: 'Многодневные', en: 'Multi Day' },
    'tour.excursions': { ru: 'Экскурсии', en: 'Excursions' },
    'tour.city_tours': { ru: 'Городские туры', en: 'City Tours' },
    'tour.nature_eco': { ru: 'Природа/экологические туры', en: 'Nature/Eco Tours' },
    'tour.cultural': { ru: 'Культурно познавательные туры', en: 'Cultural Educational Tours' },
    'tour.historical': { ru: 'Исторические туры', en: 'Historical Tours' },
    'tour.trekking': { ru: 'Походы/трекинги', en: 'Hiking/Trekking' },
    'tour.mountain_landscapes': { ru: 'Горные ландшафты', en: 'Mountain Landscapes' },
    'tour.lake_landscapes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes' },
    'tour.adventure': { ru: 'Приключенческие туры', en: 'Adventure Tours' },
    'tour.gastronomy': { ru: 'Гастрономические туры', en: 'Gastronomy Tours' },
    'tour.auto_safari': { ru: 'Автотуры/сафари/джип-туры', en: 'Auto/Safari/Jeep Tours' },
    'tour.agro': { ru: 'Агротуры', en: 'Agro Tours' },
    'tour.vip': { ru: 'VIP туры', en: 'VIP Tours' },

    // Placeholder
    'placeholder.search_perfect_tour': { ru: 'Найдите идеальный тур: Памир, Искандеркуль, треккинг...', en: 'Find the perfect tour: Pamir, Iskanderkul, trekking...' },

    // Страны
    'country.tajikistan': { ru: 'Таджикистан', en: 'Tajikistan' },
    'country.uzbekistan': { ru: 'Узбекистан', en: 'Uzbekistan' },
    'country.kyrgyzstan': { ru: 'Кыргызстан', en: 'Kyrgyzstan' },
    'country.kazakhstan': { ru: 'Казахстан', en: 'Kazakhstan' },
    'country.turkmenistan': { ru: 'Туркменистан', en: 'Turkmenistan' },

    // Типы туров
    'tour_type.personal': { ru: 'Персональный', en: 'Personal' },
    'tour_type.group_personal': { ru: 'Групповой персональный', en: 'Group Personal' },
    'tour_type.group_general': { ru: 'Групповой общий', en: 'Group General' },
    'tour_type.special': { ru: 'Специальный', en: 'Special' },

    // Заголовки сервисов
    'service.transfer_title': { ru: 'ТРАНСФЕР', en: 'TRANSFER' },
    'service.guides_title': { ru: 'ТУР-ГИДЫ', en: 'TOUR GUIDES' },
    'service.agency_title': { ru: 'АГЕНТСКИЙ СЕРВИС', en: 'AGENCY SERVICE' },
    'service.custom_tour_title': { ru: 'СОБСТВЕННЫЙ ТУР', en: 'CUSTOM TOUR' },

    // Города
    'city.dushanbe': { ru: 'Душанбе', en: 'Dushanbe' },
    'city.khorog': { ru: 'Хорог', en: 'Khorog' },
    'city.khujand': { ru: 'Худжанд', en: 'Khujand' },
    'city.tashkent': { ru: 'Ташкент', en: 'Tashkent' },
    'city.samarkand': { ru: 'Самарканд', en: 'Samarkand' },
    'city.bukhara': { ru: 'Бухара', en: 'Bukhara' },
    'city.bishkek': { ru: 'Бишкек', en: 'Bishkek' },
    'city.astana': { ru: 'Астана', en: 'Astana' },
    'city.almaty': { ru: 'Алматы', en: 'Almaty' },
    'city.ashgabat': { ru: 'Ашхабад', en: 'Ashgabat' },

    // Подвал (без дублирования)

    // Языки
    'lang.russian': { ru: 'Русский', en: 'Russian' },

    // === НОВЫЕ КЛЮЧИ ДЛЯ TOUR PAGES INTERNATIONALIZATION ===
    
    // Tour template page specific keys
    'tour.page_title': { ru: 'Тур - Bunyod-Tour v4.0', en: 'Tour - Bunyod-Tour v4.0' },
    'tour.duration_label': { ru: 'Продолжительность:', en: 'Duration:' },
    'tour.meals_included_label': { ru: 'Приём включен:', en: 'Meals included:' },
    'tour.meals_not_included': { ru: 'Приём не включен', en: 'Meals not included' },
    'tour.languages_label': { ru: 'Языки:', en: 'Languages:' },
    'tour.tab.description': { ru: 'Описание', en: 'Description' },
    'tour.tab.program': { ru: 'Программа тура', en: 'Tour Program' },
    'tour.included': { ru: 'Что включено:', en: 'What\'s included:' },
    'tour.not_included': { ru: 'Не включено в тур:', en: 'Not included in tour:' },
    'tour.reviews': { ru: 'Отзывы', en: 'Reviews' },
    'tour.loading_reviews': { ru: 'Загрузка отзывов...', en: 'Loading reviews...' },
    'tour.price_per_person': { ru: 'за человека', en: 'per person' },
    
    // Navigation submenus for tours
    'nav.tours.one_day': { ru: 'Однодневные', en: 'One Day' },
    'nav.tours.multi_day': { ru: 'Многодневные', en: 'Multi Day' },
    'nav.tours.excursions': { ru: 'Экскурсии', en: 'Excursions' },
    'nav.tours.city_tours': { ru: 'Городские туры', en: 'City Tours' },
    'nav.tours.nature_eco': { ru: 'Природа/экологические туры', en: 'Nature/Eco Tours' },
    'nav.tours.cultural': { ru: 'Культурно познавательные туры', en: 'Cultural Educational Tours' },
    'nav.tours.historical': { ru: 'Исторические туры', en: 'Historical Tours' },
    'nav.tours.hiking': { ru: 'Походы/трекинги', en: 'Hiking/Trekking' },
    'nav.tours.mountain': { ru: 'Горные ландшафты', en: 'Mountain Landscapes' },
    'nav.tours.lakes': { ru: 'Озерные ландшафты', en: 'Lake Landscapes' },
    'nav.tours.adventure': { ru: 'Приключенческие туры', en: 'Adventure Tours' },
    'nav.tours.gastronomy': { ru: 'Гастрономические туры', en: 'Gastronomy Tours' },
    'nav.tours.safari': { ru: 'Автотуры/сафари/джип-туры', en: 'Auto/Safari/Jeep Tours' },
    'nav.tours.agro': { ru: 'Агротуры', en: 'Agro Tours' },
    'nav.tours.vip': { ru: 'VIP туры', en: 'VIP Tours' },
    
    // Tourist menu navigation
    'nav.tourists.instructions': { ru: 'Инструкция сайта', en: 'Site Instructions' },
    'nav.tourists.special_notes': { ru: 'Специальные заметки', en: 'Special Notes' },
    'nav.tourists.contract': { ru: 'Договор оферта', en: 'Offer Agreement' },
    'nav.tourists.payment_rules': { ru: 'Правила оплаты и возврата средств', en: 'Payment and Refund Rules' },
    
    // Tour agents navigation
    'nav.agents': { ru: 'Тур-агенты', en: 'Tour Agents' },
    'nav.agents.our_agents': { ru: 'Наши турагенты', en: 'Our Tour Agents' },
    'nav.agents.for_agents': { ru: 'Для турагентов', en: 'For Tour Agents' },
    
    // Language selector
    'nav.lang.russian': { ru: 'Русский', en: 'Russian' },
    
    // Breadcrumb navigation
    'breadcrumb.central_asia': { ru: 'Туры по Центральной Азии', en: 'Central Asia Tours' },
    'breadcrumb.tajikistan': { ru: 'Туры по Таджикистану', en: 'Tajikistan Tours' },
    'breadcrumb.mountain_tours': { ru: 'Горные туры', en: 'Mountain Tours' },
    
    // Buttons and actions
    'btn.more_photos': { ru: 'Ещё фото', en: 'More Photos' },
    'btn.view_all_photos': { ru: 'Посмотреть все фотографии', en: 'View All Photos' },
    'btn.share': { ru: 'Поделиться', en: 'Share' },
    'btn.copy_link': { ru: 'Скопировать ссылку', en: 'Copy Link' },
    'btn.download_pdf': { ru: 'Скачать PDF', en: 'Download PDF' },
    'btn.apply': { ru: 'Применить', en: 'Apply' },
    
    // Form elements
    'form.check_dates': { ru: 'Проверить доступные даты', en: 'Check Available Dates' },
    'form.travelers_count': { ru: 'Количество туристов', en: 'Number of Travelers' },
    'form.one_adult': { ru: '1 взрослый', en: '1 Adult' },
    'form.max_travelers_note': { ru: 'Вы можете выбрать до 15 туристов всего', en: 'You can select up to 15 travelers total' },
    'form.adults_age': { ru: 'Взрослые (от 9 лет)', en: 'Adults (9+ years)' },
    'form.adults_range': { ru: 'Минимум: 1, Максимум: 15', en: 'Minimum: 1, Maximum: 15' },
    'form.children_age': { ru: 'Ребёнок (до 8 лет)', en: 'Child (up to 8 years)' },
    'form.children_range': { ru: 'Минимум: 0, Максимум: 15', en: 'Minimum: 0, Maximum: 15' },
    'form.infants_age': { ru: 'Младенцы (0-2 лет)', en: 'Infants (0-2 years)' },
    'form.tour_start_time': { ru: 'Время начала тура', en: 'Tour Start Time' },
    'form.no_hidden_fees': { ru: 'Никаких скрытых платежей', en: 'No Hidden Fees' },
    'form.select_country_first': { ru: 'Сначала выберите страну', en: 'Select country first' },
    
    // Calendar days
    'calendar.mon': { ru: 'Пн', en: 'Mon' },
    'calendar.tue': { ru: 'Вт', en: 'Tue' },
    'calendar.wed': { ru: 'Ср', en: 'Wed' },
    'calendar.thu': { ru: 'Чт', en: 'Thu' },
    'calendar.fri': { ru: 'Пт', en: 'Fri' },
    'calendar.sat': { ru: 'Сб', en: 'Sat' },
    'calendar.sun': { ru: 'Вс', en: 'Sun' },
    
    // Filter sections for tours.html
    'filters.title': { ru: 'Фильтры поиска', en: 'Search Filters' },
    'filters.destination': { ru: 'Направление', en: 'Destination' },
    'filters.format': { ru: 'Формат тура', en: 'Tour Format' },
    'filters.duration': { ru: 'Длительность тура', en: 'Tour Duration' },
    'filters.theme': { ru: 'Тематика тура', en: 'Tour Theme' },
    'filters.group': { ru: 'Групповой', en: 'Group' },
    'filters.individual': { ru: 'Индивидуальный', en: 'Individual' },
    'filters.one_day': { ru: 'Однодневный', en: 'One Day' },
    'filters.multi_day': { ru: 'Многодневный (2-5 дней)', en: 'Multi Day (2-5 days)' },
    'filters.long_term': { ru: 'Длительный (6+ дней)', en: 'Long Term (6+ days)' },
    
    // Filter theme options
    'filters.theme.overview': { ru: 'Обзорная экскурсия', en: 'Overview Excursion' },
    'filters.theme.trekking': { ru: 'Походы / трекинг', en: 'Hiking / Trekking' },
    'filters.theme.mountain': { ru: 'Горные маршруты', en: 'Mountain Routes' },
    'filters.theme.lake': { ru: 'Озёрные маршруты', en: 'Lake Routes' },
    'filters.theme.historical': { ru: 'Исторический тур', en: 'Historical Tour' },
    'filters.theme.recreational': { ru: 'Рекреационный тур', en: 'Recreational Tour' },
    'filters.theme.agro': { ru: 'Агро-туризм', en: 'Agro Tourism' },
    'filters.theme.health': { ru: 'Санаторно-оздоровительный тур', en: 'Health & Wellness Tour' },
    'filters.theme.combined': { ru: 'Комбинированный тур по Центральной Азии', en: 'Combined Central Asia Tour' },
    
    // Date filter
    'filters.date': { ru: 'Дата проведения', en: 'Date' },
    
    // === НОВЫЕ КЛЮЧИ ДЛЯ АДМИН-ПАНЕЛИ ===
    
    // Дополнительные административные разделы
    'admin.price_calculator': { ru: 'Калькулятор цен', en: 'Price Calculator' },
    'admin.banner_management': { ru: 'Управление баннерами', en: 'Banner Management' },
    'admin.tour_agents': { ru: 'Турагенты', en: 'Tour Agents' },
    'admin.trips': { ru: 'Поездки', en: 'Trips' },
    'admin.exchange_rates': { ru: 'Курсы валют', en: 'Exchange Rates' },
    'admin.cms_content': { ru: 'CMS - Контент', en: 'CMS - Content' },
    'admin.translations': { ru: 'Переводы', en: 'Translations' },
    'admin.monthly_revenue': { ru: 'Доход за месяц', en: 'Monthly Revenue' },
    'admin.active_customers': { ru: 'Активные клиенты', en: 'Active Customers' },
    'admin.sales_chart': { ru: 'График продаж', en: 'Sales Chart' },
    'admin.popular_destinations': { ru: 'Популярные направления', en: 'Popular Destinations' },
    'admin.manage_hotels': { ru: 'Управление отелями', en: 'Hotel Management' },
    'admin.manage_guides': { ru: 'Управление гидами', en: 'Guide Management' },
    'admin.manage_tour_agents': { ru: 'Управление турагентами', en: 'Tour Agent Management' },
    'admin.manage_drivers': { ru: 'Управление водителями', en: 'Driver Management' },
    'admin.manage_trips': { ru: 'Управление поездками', en: 'Trip Management' },
    'admin.transfer_requests': { ru: 'Запросы трансфера', en: 'Transfer Requests' },
    'admin.manage_countries': { ru: 'Управление странами', en: 'Country Management' },
    'admin.manage_cities': { ru: 'Управление городами', en: 'City Management' },
    'admin.total_views': { ru: 'Всего просмотров', en: 'Total Views' },
    'admin.total_news': { ru: 'Всего новостей', en: 'Total News' },
    'admin.published': { ru: 'Опубликовано', en: 'Published' },
    'admin.drafts': { ru: 'Черновики', en: 'Drafts' },
    'admin.tour_blocks': { ru: 'Блоки туров', en: 'Tour Blocks' },
    'admin.site_settings': { ru: 'Настройки сайта', en: 'Site Settings' },
    'admin.tour_form': { ru: 'Форма тура', en: 'Tour Form' },
    'admin.manage_tour_blocks': { ru: 'Управление блоками туров', en: 'Tour Block Management' },

    // Заголовки таблиц
    'table.order_number': { ru: 'Заказ №', en: 'Order #' },
    'table.client': { ru: 'Клиент', en: 'Client' },
    'table.tour': { ru: 'Тур', en: 'Tour' },
    'table.date': { ru: 'Дата', en: 'Date' },
    'table.amount': { ru: 'Сумма', en: 'Amount' },
    'table.status': { ru: 'Статус', en: 'Status' },
    'table.actions': { ru: 'Действия', en: 'Actions' },
    'table.name': { ru: 'Название', en: 'Name' },
    'table.category': { ru: 'Категория', en: 'Category' },
    'table.country': { ru: 'Страна', en: 'Country' },
    'table.city': { ru: 'Город', en: 'City' },
    'table.duration': { ru: 'Длительность', en: 'Duration' },
    'table.price': { ru: 'Цена', en: 'Price' },
    'table.title': { ru: 'Заголовок', en: 'Title' },
    'table.author': { ru: 'Автор', en: 'Author' },
    'table.publish_date': { ru: 'Дата публикации', en: 'Publish Date' },
    'table.views': { ru: 'Просмотры', en: 'Views' },
    'table.block_name_ru': { ru: 'Название блока (RU)', en: 'Block Name (RU)' },
    'table.block_name_en': { ru: 'Название блока (EN)', en: 'Block Name (EN)' },
    'table.slug': { ru: 'Слаг', en: 'Slug' },
    'table.tour_count': { ru: 'Количество туров', en: 'Tour Count' },
    'table.order': { ru: 'Порядок', en: 'Order' },

    // Дополнительные кнопки
    'btn.add_tour': { ru: 'Добавить тур', en: 'Add Tour' },
    'btn.create_tour_block': { ru: 'Создать блок туров', en: 'Create Tour Block' },
    'btn.add_hotel': { ru: 'Добавить отель', en: 'Add Hotel' },
    'btn.add_guide': { ru: 'Добавить гида', en: 'Add Guide' },
    'btn.add_tour_agent': { ru: 'Добавить турагента', en: 'Add Tour Agent' },
    'btn.add_driver': { ru: 'Добавить водителя', en: 'Add Driver' },
    'btn.add_trip': { ru: 'Добавить поездку', en: 'Add Trip' },
    'btn.add_country': { ru: 'Добавить страну', en: 'Add Country' },
    'btn.add_city': { ru: 'Добавить город', en: 'Add City' },

    // Статусы заказов
    'status.pending': { ru: 'В ожидании', en: 'Pending' },
    'status.confirmed': { ru: 'Подтвержден', en: 'Confirmed' },
    'status.paid': { ru: 'Оплачен', en: 'Paid' },
    'status.completed': { ru: 'Завершен', en: 'Completed' },
    'status.cancelled': { ru: 'Отменен', en: 'Cancelled' },

    // Вкладки
    'tab.all_orders': { ru: 'Все заказы', en: 'All Orders' },

    // Формы и поля
    'form.pickup_info': { ru: 'Информация о встрече/трансфере', en: 'Pickup/Meeting Information' },
    'form.tour_languages': { ru: 'Языки тура', en: 'Tour Languages' },
    'form.min_people': { ru: 'Минимальное количество людей', en: 'Minimum Number of People' },
    'form.max_people': { ru: 'Максимальное количество людей', en: 'Maximum Number of People' },
    'form.available_months': { ru: 'Доступные месяцы', en: 'Available Months' },
    'form.available_days': { ru: 'Доступные дни', en: 'Available Days' },
    'form.tour_photos': { ru: 'Фотографии тура', en: 'Tour Photos' },

    // Дополнительные placeholder'ы
    'placeholder.search_tours': { ru: 'Поиск туров...', en: 'Search tours...' },
    'placeholder.search_hotels': { ru: 'Поиск отелей...', en: 'Search hotels...' },
    'placeholder.search_tour_agents': { ru: 'Поиск турагентов...', en: 'Search tour agents...' },
    'placeholder.enter_text_for_translation': { ru: 'Введите текст для перевода...', en: 'Enter text for translation...' },
    'placeholder.translated_text_will_appear': { ru: 'Переведенный текст появится здесь...', en: 'Translated text will appear here...' },
    'placeholder.service_name_example': { ru: 'Например: Обед в ресторане', en: 'For example: Restaurant lunch' },
    'placeholder.component_additional_info': { ru: 'Дополнительная информация о компоненте', en: 'Additional component information' },
    'placeholder.slide_title': { ru: 'Заголовок слайда', en: 'Slide title' },
    'placeholder.slide_description': { ru: 'Описание слайда', en: 'Slide description' },
    'placeholder.learn_more': { ru: 'Узнать больше', en: 'Learn more' },
    'placeholder.hotel_name_example': { ru: 'Hilton Dushanbe, Serena Hotel и т.д.', en: 'Hilton Dushanbe, Serena Hotel, etc.' },
    'placeholder.hotel_description_ru': { ru: 'Краткое описание отеля, местоположение и особенности на русском...', en: 'Brief hotel description, location and features in Russian...' },
    'placeholder.enter_new_brand': { ru: 'Введите название нового бренда', en: 'Enter new brand name' },
    'placeholder.city_examples': { ru: 'Душанбе, Самарканд, Бишкек и т.д.', en: 'Dushanbe, Samarkand, Bishkek, etc.' },
    'placeholder.enter_new_amenity': { ru: 'Введите название новой услуги', en: 'Enter new amenity name' },
    'placeholder.meeting_with_guide': { ru: 'Встреча с гидом', en: 'Meeting with guide' },
    'placeholder.detailed_stage_description': { ru: 'Подробное описание этапа', en: 'Detailed stage description' },
    'placeholder.pickup_info_example': { ru: 'Например: Трансфер включен, Место встречи: отель и т.д.', en: 'For example: Pickup included, Meeting point: hotel, etc.' },
    'placeholder.enter_service_name': { ru: 'Введите название услуги', en: 'Enter service name' },
    'placeholder.news_brief_description': { ru: 'Краткое описание новости (по желанию)', en: 'Brief news description (optional)' },

    // Языки
    'language.russian': { ru: 'Русский', en: 'Russian' }
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
        'en': { name: 'English', flag: '🇺🇸', flagClass: 'flag-us', code: 'EN' },
        'tj': { name: 'Тоҷикӣ', flag: '🇹🇯', flagClass: 'flag-tj', code: 'TJ' }
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


// === ГЛОБАЛЬНАЯ УТИЛИТА ДЛЯ МНОГОЯЗЫЧНЫХ ДАННЫХ ===
window.getMultilingualValue = function(obj, baseKey, fallback = '') {
    if (!obj) return fallback || '';
    const lang = (window.currentLanguage || 'en').toLowerCase();
    const suffix = lang === 'en' ? 'En' : lang === 'ru' ? 'Ru' : 'Tj';
    const tryKeys = [baseKey + suffix, baseKey + 'En', baseKey + 'Ru', baseKey + 'Tj', baseKey, 'name', 'title'];
    for (const k of tryKeys) {
        const v = obj[k];
        if (v) {
            if (typeof v === 'object') {
                return v[lang] || v.en || v.ru || v.tj || fallback || '';
            }
            return String(v);
        }
    }
    return fallback || '';
};

// === ЭКСПОРТ КЛЮЧЕВЫХ ФУНКЦИЙ ДЛЯ ВНЕШНЕГО ИСПОЛЬЗОВАНИЯ ===
// Функция переключения языка (используется layout-loader.js)
window.switchLanguage = switchSiteLanguage;

// Функция применения переводов (для прямого вызова)
window.applyTranslations = translateStaticInterface;

// Функция инициализации языка
window.initializeLanguage = initializeLanguage;

// Функция обновления селектора языка
window.updateLanguageSelector = updateLanguageSelector;

console.log('🌍 i18n система инициализирована с экспортированными функциями');

})(); // Закрываем IIFE