/**
 * HOME PAGE JAVASCRIPT MODULE
 * Модуль для главной страницы сайта Bunyod-Tour
 * Includes: filters, search, tours display, country/city management
 */

// Функция для переключения деталей информационных блоков
function toggleDetails(detailsId, button) {
    const detailsElement = document.getElementById(detailsId);
    
    if (detailsElement.classList.contains('hidden')) {
        detailsElement.classList.remove('hidden');
    } else {
        detailsElement.classList.add('hidden');
    }
}

// Данные о городах по странам - загружаются динамически из API
let citiesByCountry = {};
let countriesData = [];
let citiesData = [];

// Загрузка стран и городов из API
async function loadCountriesAndCities() {
    try {
        // Загружаем страны
        const countriesResponse = await fetch('/api/countries');
        if (countriesResponse.ok) {
            const countriesResult = await countriesResponse.json();
            if (countriesResult.success) {
                countriesData = countriesResult.data;
            }
        }
        
        // Загружаем города
        const citiesResponse = await fetch('/api/cities');
        if (citiesResponse.ok) {
            const citiesResult = await citiesResponse.json();
            if (citiesResult.success) {
                citiesData = citiesResult.data;
                
                // Группируем города по странам
                citiesByCountry = {};
                countriesData.forEach(country => {
                    const countryName = getMultilingualValue(country, 'name');
                    const countryCities = citiesData.filter(city => 
                        city.countryId === country.id
                    ).map(city => getMultilingualValue(city, 'name'));
                    citiesByCountry[countryName] = countryCities;
                });
                
            }
        }
    } catch (error) {
        console.error('❌ Error loading countries and cities:', error);
        // Fallback к старым данным если API недоступен
        citiesByCountry = {
            'Таджикистан': ['Душанбе', 'Худжанд', 'Хорог'],
            'Узбекистан': ['Ташкент', 'Самарканд', 'Бухара'],
            'Кыргызстан': ['Бишкек'],
            'Казахстан': ['Астана', 'Алматы'],
            'Туркменистан': ['Ашхабад']
        };
    }
}

// Данные отелей по странам
const hotelsByCountry = {
    'Таджикистан': [
        {group: 'Люкс сегмент', hotels: ['Serena Hotels', 'Crystal Hotels']},
        {group: 'Премиум сегмент', hotels: ['Hilton', 'Marriott', 'InterContinental', 'Hyatt']},
        {group: 'Средний сегмент', hotels: ['Holiday Inn', 'Radisson', 'Novotel']},
        {group: 'Местные и региональные', hotels: ['Golden Tulip', 'Maritim']}
    ],
    'Узбекистан': [
        {group: 'Люкс сегмент', hotels: ['Four Seasons', 'Ritz-Carlton', 'St. Regis']},
        {group: 'Премиум сегмент', hotels: ['Hilton', 'Marriott', 'Hyatt', 'InterContinental', 'Sheraton', 'Westin']},
        {group: 'Средний сегмент', hotels: ['Holiday Inn', 'Courtyard', 'Radisson', 'Novotel', 'Ibis']},
        {group: 'Местные и региональные', hotels: ['Serena Hotels', 'Golden Tulip', 'Barcelo']}
    ],
    'Казахстан': [
        {group: 'Люкс сегмент', hotels: ['Ritz-Carlton', 'St. Regis', 'Four Seasons']},
        {group: 'Премиум сегмент', hotels: ['Marriott', 'Hilton', 'InterContinental', 'Hyatt', 'Sheraton']},
        {group: 'Средний сегмент', hotels: ['Holiday Inn', 'Radisson', 'Courtyard', 'Hampton Inn']},
        {group: 'Бюджетный сегмент', hotels: ['Holiday Inn Express', 'Comfort Inn', 'Best Western']}
    ],
    'Кыргызстан': [
        {group: 'Премиум сегмент', hotels: ['Hyatt', 'Sheraton']},
        {group: 'Средний сегмент', hotels: ['Radisson', 'Novotel', 'Holiday Inn']},
        {group: 'Бюджетный сегмент', hotels: ['Best Western', 'Comfort Inn']},
        {group: 'Местные и региональные', hotels: ['Golden Tulip', 'Crystal Hotels']}
    ],
    'Туркменистан': [
        {group: 'Люкс сегмент', hotels: ['Aman']},
        {group: 'Премиум сегмент', hotels: ['Sheraton', 'Sofitel']},
        {group: 'Средний сегмент', hotels: ['Radisson', 'Holiday Inn']},
        {group: 'Местные и региональные', hotels: ['Golden Tulip', 'Maritim']}
    ]
};

// Функция для обновления списка городов
function updateCities() {
    const countrySelect = document.getElementById('countryFilter');
    const citySelect = document.getElementById('cityFilter');
    
    // Очищаем список городов
    citySelect.innerHTML = '<option value="">Город</option>';
    
    const selectedCountry = countrySelect.value;
    if (selectedCountry && citiesByCountry[selectedCountry]) {
        citiesByCountry[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// Функция для обновления списка отелей
function updateHotels() {
    const countrySelect = document.getElementById('countryFilter');
    const hotelSelect = document.getElementById('hotelFilter');
    
    // Очищаем список отелей
    hotelSelect.innerHTML = '<option value="">Гостиницы</option>';
    
    const selectedCountry = countrySelect.value;
    if (selectedCountry && hotelsByCountry[selectedCountry]) {
        hotelsByCountry[selectedCountry].forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.group;
            
            group.hotels.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel;
                optgroup.appendChild(option);
            });
            
            hotelSelect.appendChild(optgroup);
        });
    }
}

// Новая функция для обновления фильтров отелей на основе страны
function updateHotelFilters() {
    const country = document.getElementById('countryFilter').value;
    const hotelBrandFilter = document.getElementById('hotelBrandFilter');
    const hotelStarsFilter = document.getElementById('hotelStarsFilter');
    
    // Проверяем, что элементы существуют
    if (!hotelBrandFilter || !hotelStarsFilter) {
        return;
    }
    
    // Сбрасываем фильтры, если не выбрана страна
    if (!country) {
        hotelBrandFilter.disabled = false;
        hotelStarsFilter.disabled = false;
        return;
    }
    
    // Включаем фильтры для определённых стран (используем динамические данные)
    const countriesWithHotels = countriesData.map(c => c.nameRu) || ['Таджикистан', 'Узбекистан', 'Кыргызстан', 'Казахстан'];
    
    if (countriesWithHotels.includes(country)) {
        hotelBrandFilter.disabled = false;
        hotelStarsFilter.disabled = false;
    } else {
        hotelBrandFilter.disabled = true;
        hotelStarsFilter.disabled = true;
        hotelBrandFilter.value = '';
        hotelStarsFilter.value = '';
    }
}

// Функция для переключения панели фильтров
function toggleFilterPanel() {
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel.classList.contains('hidden')) {
        filterPanel.classList.remove('hidden');
    } else {
        filterPanel.classList.add('hidden');
    }
}

// Переменные для автодополнения
let searchTimeout;
let currentSuggestions = [];

// Функция для обработки ввода в поисковую строку
function handleSearchInput(query) {
    clearTimeout(searchTimeout);
    
    if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
            fetchSuggestions(query);
        }, 300); // Задержка 300мс для избежания лишних запросов
    } else {
        hideSuggestions();
    }
}

// Функция для получения подсказок
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`${window.location.origin}/api/tours/suggestions?query=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            currentSuggestions = result.data;
            displaySuggestions(result.data);
        } else {
            // Показываем стандартные подсказки если API недоступен
            showDefaultSuggestions(query);
        }
    } catch (error) {
        // Показываем стандартные подсказки если API недоступен
        showDefaultSuggestions(query);
    }
}

// Функция для отображения подсказок
function displaySuggestions(suggestions) {
    const container = document.getElementById('searchSuggestions');
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    // Безопасное создание DOM элементов (защита от XSS)
    container.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-item';
        suggestionDiv.onclick = () => selectSuggestion(suggestion.text, suggestion.type);
        
        const iconSvg = document.createElement('svg');
        iconSvg.className = 'suggestion-icon';
        iconSvg.setAttribute('fill', 'none');
        iconSvg.setAttribute('stroke', 'currentColor');
        iconSvg.setAttribute('viewBox', '0 0 24 24');
        iconSvg.innerHTML = getSuggestionIcon(suggestion.type);
        
        const textSpan = document.createElement('span');
        textSpan.className = 'suggestion-text';
        textSpan.textContent = suggestion.text; // Безопасная вставка текста
        
        const typeSpan = document.createElement('span');
        typeSpan.className = 'suggestion-type';
        typeSpan.textContent = suggestion.type; // Безопасная вставка текста
        
        suggestionDiv.appendChild(iconSvg);
        suggestionDiv.appendChild(textSpan);
        suggestionDiv.appendChild(typeSpan);
        
        container.appendChild(suggestionDiv);
    });
    
    container.classList.remove('hidden');
}

// Функция для получения иконки подсказки
function getSuggestionIcon(type) {
    switch(type) {
        case 'тур':
            return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>';
        case 'место':
            return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>';
        case 'категория':
            return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>';
        default:
            return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>';
    }
}

// Функция для отображения стандартных подсказок
function showDefaultSuggestions(query) {
    const defaultSuggestions = [
        { text: 'Памир', type: 'место' },
        { text: 'Искандеркуль', type: 'место' },
        { text: 'Душанбе', type: 'место' },
        { text: 'Горные туры', type: 'категория' },
        { text: 'Трекинг', type: 'категория' },
        { text: 'Культурные туры', type: 'категория' }
    ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()));
    
    if (defaultSuggestions.length > 0) {
        displaySuggestions(defaultSuggestions);
    }
}

// Функция для выбора подсказки
function selectSuggestion(text, type) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = text;
    hideSuggestions();
    
    // Автоматически запускаем поиск
    if (type === 'тур') {
        // Если это тур, переходим к расширенному поиску
        window.location.href = `tours-search.html?query=${encodeURIComponent(text)}`;
    } else {
        // Иначе просто выполняем поиск на текущей странице
        performSearch();
    }
}

// Функция для показа подсказок
function showSuggestions() {
    const query = document.getElementById('searchInput').value.trim();
    if (query.length >= 2 && currentSuggestions.length > 0) {
        document.getElementById('searchSuggestions').classList.remove('hidden');
    }
}

// Функция для скрытия подсказок
function hideSuggestions() {
    setTimeout(() => {
        document.getElementById('searchSuggestions').classList.add('hidden');
    }, 150); // Небольшая задержка для клика по подсказке
}

// Функция для основного поиска
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim();
    
    // Собираем параметры фильтров
    const filters = {
        query: searchQuery,
        country: document.getElementById('countryFilter')?.value || '',
        city: document.getElementById('cityFilter')?.value || '',
        format: document.getElementById('formatFilter')?.value || '',
        category: document.getElementById('categoryFilter')?.value || '',
        hotel: document.getElementById('hotelFilter')?.value || '',
        date: document.getElementById('dateFilter')?.value || ''
    };
    
    // Убираем пустые значения
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            queryParams.append(key, value);
        }
    });
    
    // Переходим на страницу расширенного поиска с параметрами
    window.location.href = `tours-search.html?${queryParams.toString()}`;
}

// Функция для поиска по тексту
async function searchToursByText(query) {
    try {
        const response = await fetch(`${window.location.origin}/api/tours/search?query=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.success) {
            displaySearchResults(result.data);
        } else {
            console.error('Ошибка поиска:', result.error);
            // Показываем заглушку если API недоступен
            displayMockSearchResults(query);
        }
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
        // Показываем заглушку если API недоступен
        displayMockSearchResults(query);
    }
}

// Функция для поиска туров по фильтрам
async function searchTours() {
    try {
        const filters = {
            country: document.getElementById('countryFilter')?.value || '',
            city: document.getElementById('cityFilter')?.value || '',
            format: document.getElementById('formatFilter')?.value || '',
            category: document.getElementById('categoryFilter')?.value || '',
            hotel: document.getElementById('hotelFilter')?.value || '',
            hotelBrand: document.getElementById('hotelBrandFilter')?.value || '',
            hotelStars: document.getElementById('hotelStarsFilter')?.value || '',
            date: document.getElementById('dateFilter')?.value || ''
        };

        console.log('🔍 Searching tours with filters:', filters);

        // Убираем пустые фильтры
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        // Конвертируем страны и города в ID для API запроса
        if (filters.country) {
            const country = countriesData.find(c => c.nameRu === filters.country);
            if (country) {
                queryParams.set('countryId', country.id.toString());
                queryParams.delete('country');
            }
        }
        
        if (filters.city) {
            const city = citiesData.find(c => c.nameRu === filters.city);
            if (city) {
                queryParams.set('cityId', city.id.toString());
                queryParams.delete('city');
            }
        }

        // Вызываем API для поиска туров
        const apiUrl = `/api/tours?${queryParams.toString()}`;
        console.log('📡 API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success) {
            displaySearchResults(result.data);
        } else {
            console.error('❌ Search error:', result.error);
            displayMockSearchResults('');
        }
    } catch (error) {
        console.error('❌ Error searching tours:', error);
        displayMockSearchResults('');
    }
}


// Функция для отображения демо результатов
function displayMockSearchResults(query) {
    const mockTours = [
        {
            title: { ru: 'Памирское шоссе' },
            description: { ru: 'Захватывающее путешествие по одной из самых высокогорных дорог мира' },
            country: 'Таджикистан',
            city: 'Хорог',
            format: 'Групповой',
            duration: '7 дней',
            theme: 'Горные ландшафты',
            price: 299
        },
        {
            title: { ru: 'Озеро Искандеркуль' },
            description: { ru: 'Живописное горное озеро в окружении заснеженных пиков' },
            country: 'Таджикистан',
            city: 'Пенджикент',
            format: 'Персональный',
            duration: '2 дня',
            theme: 'Озерные ландшафты',
            price: 149
        },
        {
            title: { ru: 'Древний Пенджикент' },
            description: { ru: 'Исследуйте руины древнего согдийского города' },
            country: 'Таджикистан',
            city: 'Пенджикент',
            format: 'Групповой',
            duration: '1 день',
            theme: 'Исторические туры',
            price: 89
        }
    ];

    displaySearchResults(mockTours);
}

// Функция для отображения результатов поиска
function displaySearchResults(tours) {
    const searchResults = document.getElementById('searchResults');
    const toursGrid = document.getElementById('toursGrid');
    
    if (!tours || tours.length === 0) {
        toursGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <h3 class="text-xl text-gray-600">Туры не найдены</h3>
                <p class="text-gray-500 mt-2">Попробуйте изменить критерии поиска</p>
            </div>
        `;
    } else {
        toursGrid.innerHTML = tours.map(tour => createTourCard(tour)).join('');
    }
    
    // Показываем блок результатов и скрываем популярные туры
    searchResults.classList.remove('hidden');
    document.querySelector('section.bg-gray-50').style.display = 'none';
}

// Функция для создания карточки тура
function createTourCard(tour) {
    return `
        <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <div class="h-64 bg-gray-200 flex items-center justify-center">
                <span class="text-white text-lg font-semibold">${tour.country}</span>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-900" data-tour-title data-title-ru="${escapeDataAttribute(getTitleByLanguageRaw(tour.title, 'ru'))}" data-title-en="${escapeDataAttribute(getTitleByLanguageRaw(tour.title, 'en'))}">${getTitleByLanguage(tour.title, window.i18n ? window.i18n.currentLanguage() : 'ru')}</h3>
                    <div class="flex flex-col gap-1">
                        <!-- Тип тура (format/tourType) -->
                        <div class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            ${tour.format || tour.tourType || 'Групповой'}
                        </div>
                        <!-- Категория тура -->
                        ${tour.category ? `
                        <div class="flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: #3E3E3E; color: white;">
                            <span data-tour-category data-cat-ru="${escapeDataAttribute(getCategoryNameByLanguageRaw(tour.category.name, 'ru'))}" data-cat-en="${escapeDataAttribute(getCategoryNameByLanguageRaw(tour.category.name, 'en'))}">${getCategoryNameByLanguage(tour.category.name, window.i18n ? window.i18n.currentLanguage() : 'ru')}</span>
                        </div>` : ''}
                    </div>
                </div>
                <p class="text-gray-600 mb-4 flex-grow" data-tour-description data-desc-ru="${escapeDataAttribute(getDescriptionByLanguageRaw(tour.description, 'ru'))}" data-desc-en="${escapeDataAttribute(getDescriptionByLanguageRaw(tour.description, 'en'))}">
                    ${getDescriptionByLanguage(tour.description, window.i18n ? window.i18n.currentLanguage() : 'ru')}
                </p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>📍 ${tour.city}</span>
                    <span>⏱️ ${tour.duration}</span>
                    <span>🎯 ${tour.theme}</span>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-2xl font-bold" style="color: black;">от $${tour.price}</span>
                    <button class="text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors" style="background-color: #3E3E3E;">
                        Бронировать
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Функция для сброса поиска (убрана кнопка сброса из интерфейса)
function clearSearch() {
    document.getElementById('searchResults').classList.add('hidden');
    document.querySelector('section.bg-gray-50').style.display = 'block';
    
    // Сброс поискового запроса
    document.getElementById('searchInput').value = '';
    
    // Сброс всех фильтров
    const countryFilter = document.getElementById('countryFilter');
    const cityFilter = document.getElementById('cityFilter');
    const formatFilter = document.getElementById('formatFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const hotelFilter = document.getElementById('hotelFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (countryFilter) countryFilter.value = '';
    if (cityFilter) cityFilter.value = '';
    if (formatFilter) formatFilter.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (hotelFilter) hotelFilter.value = '';
    if (dateFilter) dateFilter.value = '';
    
    // Скрыть панель фильтров
    document.getElementById('filterPanel').classList.add('hidden');
    
    // Обновляем список городов и отелей
    updateCities();
    updateHotels();
}

// Функция для фильтрации по стране из карточек
function filterByCountry(country) {
    const themeFilter = document.getElementById('themeFilter');
    const countryFilter = document.getElementById('countryFilter');
    
    // Устанавливаем фильтр страны
    if (country === 'комбинированный') {
        // Для комбинированного тура ищем туры с несколькими странами или специальной тематикой
        if (themeFilter) themeFilter.value = 'Комбинированный тур по Центральной Азии';
        if (countryFilter) countryFilter.value = '';
    } else {
        if (countryFilter) countryFilter.value = country;
        if (themeFilter) themeFilter.value = '';
    }
    
    // Обновляем города и отели для выбранной страны
    updateCities();
    updateHotels();
    updateHotelFilters();
    
    // Выполняем поиск
    searchTours();
    
    // Прокручиваем к результатам
    setTimeout(() => {
        const searchResults = document.getElementById('searchResults');
        if (searchResults && !searchResults.classList.contains('hidden')) {
            searchResults.scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
}

// Загрузка всех туров при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена с тёмно-серым фильтром');
    
    // Настройка календаря с минимальной датой
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateFilter.min = minDate;
        console.log('Минимальная дата установлена:', minDate);
    }


    
    // Карта туров с их именами и ключами
    const tourMap = {
        'Полный день: Памирское шоссе, горы и озёра': 'pamir_highway',
        'Треккинг к озёрам семи цветов': 'pamir_highway',
        'Культурный тур по столице Таджикистана': 'pamir_highway',
        'Приключение в Бадахшане и горячие источники': 'pamir_highway',
        'Древний Самарканд и мавзолей Гур-Эмир': 'samarkand',
        'Священная Бухара: мечети и медресе': 'samarkand',
        'Хива: музей под открытым небом': 'samarkand',
        'Ташкент: современность и традиции': 'samarkand',
        'Иссык-Куль и ущелье Джеты-Огуз': 'issyk_kul',
        'Столица Киргизстана и Ала-Арча': 'issyk_kul',
        'Высокогорные пастбища и юрты': 'issyk_kul',
        'Озеро Сон-Куль и кочевые традиции': 'issyk_kul',
        'Врата ада: газовый кратер Дарваза': 'darvaza',
        'Мраморная столица пустыни Каракумы': 'darvaza',
        'Древний Мерв и археологические памятники': 'darvaza',
        'Конные прогулки по пустыне': 'darvaza'
    };

    // Находим все карточки туров
    const tourCards = document.querySelectorAll('.group.cursor-pointer');
    
    tourCards.forEach(card => {
        const titleElement = card.querySelector('h3');
        const button = card.querySelector('button[style*="background-color: #3E3E3E"]');
        
        if (titleElement && button) {
            const tourTitle = titleElement.textContent.trim();
            const tourKey = tourMap[tourTitle] || 'pamir_highway';
            
            // Добавляем клик на кнопку "Бронировать"
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                window.open(`tour-template.html?tour=${tourKey}`, '_blank');
            });
            
            // Добавляем клик на всю карточку
            card.addEventListener('click', function() {
                window.open(`tour-template.html?tour=${tourKey}`, '_blank');
            });
        }
    });
    
    // Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('langDropdown');
        const button = document.querySelector('.lang-selector-btn');
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
            document.querySelector('.dropdown-arrow').classList.remove('open');
        }
    });
});

// ✨ Функции слайдшоу изображений для карточек туров
const tourSlideshows = new Map(); // Хранит интервалы для каждого тура

function startImageSlideshow(tourId) {
    // Проверяем есть ли изображения для слайдшоу
    const images = document.querySelectorAll(`img[data-tour-id="${tourId}"]`);
    console.log(`🎬 Starting slideshow for tour ${tourId}: found ${images.length} images`);
    
    if (images.length <= 1) {
        return; // Если одно изображение или меньше - не запускаем слайдшоу
    }
    
    let currentIndex = 0;
    
    // Запускаем слайдшоу с интервалом 1.5 секунды
    const interval = setInterval(() => {
        // Скрываем текущее изображение
        images[currentIndex].style.opacity = '0';
        
        // Обновляем индикатор
        const currentDot = document.querySelector(`div[data-tour-id="${tourId}"][data-slide-index="${currentIndex}"]`);
        if (currentDot) {
            currentDot.style.opacity = '0.5';
        }
        
        // Переходим к следующему изображению
        currentIndex = (currentIndex + 1) % images.length;
        
        // Показываем следующее изображение
        images[currentIndex].style.opacity = '1';
        
        // Обновляем индикатор
        const nextDot = document.querySelector(`div[data-tour-id="${tourId}"][data-slide-index="${currentIndex}"]`);
        if (nextDot) {
            nextDot.style.opacity = '1';
        }
    }, 1500); // Меняем изображение каждые 1.5 секунды
    
    // Сохраняем интервал для остановки при убирании курсора
    tourSlideshows.set(tourId, { interval, currentIndex });
}

function stopImageSlideshow(tourId) {
    console.log(`🛑 Stopping slideshow for tour ${tourId}`);
    const slideshow = tourSlideshows.get(tourId);
    if (slideshow) {
        clearInterval(slideshow.interval);
        tourSlideshows.delete(tourId);
        
        // Возвращаем к первому изображению
        const images = document.querySelectorAll(`img[data-tour-id="${tourId}"]`);
        const dots = document.querySelectorAll(`div[data-tour-id="${tourId}"]`);
        
        images.forEach((img, index) => {
            img.style.opacity = index === 0 ? '1' : '0';
        });
        
        dots.forEach((dot, index) => {
            dot.style.opacity = index === 0 ? '1' : '0.5';
        });
    }
}

// === СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКОВ ===
// 
// 🌐 currentLanguage теперь управляется центральной системой i18n.js

// Функции для языкового селектора
function toggleLanguageDropdown() {
    if (window.i18n) {
        window.i18n.toggleLanguageDropdown();
    }
}

// 🌐 ИСПОЛЬЗУЕМ ЦЕНТРАЛЬНУЮ ФУНКЦИЮ ИЗ i18n.js + ДОБАВЛЯЕМ ДИНАМИЧЕСКИЙ КОНТЕНТ
function switchSiteLanguage(lang) {
    if (window.i18n) {
        window.i18n.switchSiteLanguage(lang);
        // 🔄 ОБЯЗАТЕЛЬНО ПЕРЕВОДИМ ДИНАМИЧЕСКИЙ КОНТЕНТ
        translateDynamicContent(lang);
    } else {
        console.error('❌ i18n.js не найден!');
    }
}

// 🌐 ИСПОЛЬЗУЕМ ЦЕНТРАЛЬНУЮ ФУНКЦИЮ updateLanguageSelector ИЗ i18n.js
function updateLanguageSelector(lang) {
    if (window.i18n) {
        window.i18n.updateLanguageSelector(lang);
    }
}

// 🌐 НЕ НУЖНА - ИСПОЛЬЗУЕТСЯ АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ИЗ i18n.js

// === ЧАСТЬ 2: СЛОВАРЬ ПЕРЕВОДОВ СТАТИЧЕСКОГО ИНТЕРФЕЙСА ===

const translations = {
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
    'title.view_details': { ru: 'Посмотреть детали', en: 'View details' }
};

// Функция получения перевода
function getTranslation(key, lang = currentLanguage) {
    if (translations[key] && translations[key][lang]) {
        return translations[key][lang];
    }
    // Возвращаем русский как fallback
    if (translations[key] && translations[key]['ru']) {
        return translations[key]['ru'];
    }
    // Если перевода вообще нет, возвращаем ключ
    return key;
}

// === 🚀 УСИЛЕННАЯ ФУНКЦИЯ ПЕРЕВОДА СТАТИЧЕСКОГО ИНТЕРФЕЙСА ===

function translateStaticInterface(lang) {
    
    let translatedCount = 0;
    
    // 📝 ПЕРЕВОДИМ ОСНОВНОЙ ТЕКСТ (data-translate)
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
            console.warn(`⚠️ Перевод не найден для ключа: ${key}`);
        }
    });
    
    // 🔤 ПЕРЕВОДИМ PLACEHOLDERS (data-translate-placeholder)
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.placeholder = translation;
            translatedCount++;
        } else {
            console.warn(`⚠️ Placeholder перевод не найден для ключа: ${key}`);
        }
    });
    
    // 🖼️ ПЕРЕВОДИМ ALT АТРИБУТЫ (data-translate-alt)
    document.querySelectorAll('[data-translate-alt]').forEach(element => {
        const key = element.getAttribute('data-translate-alt');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.alt = translation;
            translatedCount++;
        }
    });
    
    // 💡 ПЕРЕВОДИМ TITLE АТРИБУТЫ (data-translate-title)
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.title = translation;
            translatedCount++;
        }
    });
    
    // 📊 ПЕРЕВОДИМ VALUE АТРИБУТЫ (data-translate-value)
    document.querySelectorAll('[data-translate-value]').forEach(element => {
        const key = element.getAttribute('data-translate-value');
        const translation = getTranslation(key, lang);
        
        if (translation && translation !== key) {
            element.value = translation;
            translatedCount++;
        }
    });
    
}

// Вспомогательная функция для обновления текстовых узлов
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

// === ЧАСТЬ 3: ПЕРЕВОД ДИНАМИЧЕСКОГО КОНТЕНТА ИЗ JSON ПОЛЕЙ ===

function translateDynamicContent(lang) {
    console.log(`🔄 Переключение динамического контента на: ${lang}`);
    
    // 🎯 ПОЛУЧАЕМ ТЕКУЩИЙ ЯЗЫК ИЗ ЦЕНТРАЛЬНОЙ СИСТЕМЫ
    const currentLang = window.i18n ? window.i18n.currentLanguage() : lang;
    
    let updatedCount = 0;
    
    // 🏷️ ОБНОВЛЯЕМ ЗАГОЛОВКИ ТУРОВ (БЕЗОПАСНЫЙ ПОДХОД)
    const tourTitles = document.querySelectorAll('[data-tour-title]');
    tourTitles.forEach(element => {
        const titleRu = element.dataset.titleRu || '';
        const titleEn = element.dataset.titleEn || '';
        const title = currentLang === 'en' ? (titleEn || titleRu || 'Название не указано') : (titleRu || titleEn || 'Название не указано');
        element.textContent = title;
        updatedCount++;
    });
    
    // 📝 ОБНОВЛЯЕМ ОПИСАНИЯ ТУРОВ (БЕЗОПАСНЫЙ ПОДХОД)
    const tourDescriptions = document.querySelectorAll('[data-tour-description]');
    tourDescriptions.forEach(element => {
        const descRu = element.dataset.descRu || '';
        const descEn = element.dataset.descEn || '';
        const description = currentLang === 'en' ? (descEn || descRu || 'Описание не указано') : (descRu || descEn || 'Описание не указано');
        element.textContent = description;
        updatedCount++;
    });
    
    // 🏷️ ОБНОВЛЯЕМ КАТЕГОРИИ ТУРОВ (БЕЗОПАСНЫЙ ПОДХОД)
    const tourCategories = document.querySelectorAll('[data-tour-category]');
    tourCategories.forEach(element => {
        const catRu = element.dataset.catRu || '';
        const catEn = element.dataset.catEn || '';
        const categoryName = currentLang === 'en' ? (catEn || catRu || 'Категория') : (catRu || catEn || 'Категория');
        element.textContent = categoryName;
        updatedCount++;
    });
    
    // 🔄 ПЕРЕРЕНДЕРИМ ТУРЫ С НОВЫМ ЯЗЫКОМ (если нужно)
    if (typeof renderTours === 'function') {
        // Если у нас есть функция renderTours, используем её
        console.log('🔄 Перерендериваем туры с новым языком...');
        renderTours();
    }
    
}

// 🎯 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ПОЛУЧЕНИЯ КОНТЕНТА ПО ЯЗЫКУ

function getTitleByLanguage(titleObject, lang) {
    // Поддерживаем как JSON строки, так и объекты
    try {
        const title = typeof titleObject === 'string' ? JSON.parse(titleObject) : titleObject;
        return title[lang] || title.ru || title.en || 'Название не указано';
    } catch (e) {
        return titleObject || 'Название не указано';
    }
}

function getDescriptionByLanguage(descriptionObject, lang) {
    try {
        const description = typeof descriptionObject === 'string' ? JSON.parse(descriptionObject) : descriptionObject;
        return description[lang] || description.ru || description.en || 'Описание не указано';
    } catch (e) {
        return descriptionObject || 'Описание не указано';
    }
}

function getCategoryNameByLanguage(categoryObject, lang) {
    try {
        const category = typeof categoryObject === 'string' ? JSON.parse(categoryObject) : categoryObject;
        return category[lang] || category.ru || category.en || 'Категория';
    } catch (e) {
        return categoryObject || 'Категория';
    }
}

function selectLanguageNew(lang, flagClass, flagEmoji, name) {
    
    // ПРИНУДИТЕЛЬНАЯ КАРТА ЭМОДЗИ (на случай если параметр испорчен)
    const emojiMap = {
        'ru': '🇷🇺', 'flag-ru': '🇷🇺',
        'en': '🇺🇸', 'flag-us': '🇺🇸', 'us': '🇺🇸',
        'fa': '🇮🇷', 'flag-ir': '🇮🇷', 'ir': '🇮🇷',
        'de': '🇩🇪', 'flag-de': '🇩🇪',
        'zh': '🇨🇳', 'flag-cn': '🇨🇳', 'cn': '🇨🇳'
    };
    
    // ГАРАНТИРОВАННЫЙ эмодзи (приоритет: карта по lang -> карта по flagClass -> flagEmoji -> fallback)
    const correctEmoji = emojiMap[lang] || emojiMap[flagClass] || flagEmoji || '🌐';
    
    // Обновляем кнопку селектора - ПРИНУДИТЕЛЬНО используем правильный эмодзи
    const selectedFlag = document.querySelector('.selected-flag');
    selectedFlag.className = `selected-flag ${flagClass}`;
    selectedFlag.textContent = correctEmoji; // ПРИНУДИТЕЛЬНО правильный эмодзи
    selectedFlag.innerHTML = correctEmoji;   // На всякий случай и innerHTML
    document.querySelector('.selected-lang').textContent = name;
    
    // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: Принудительно исправляем ВСЕ флаги в выпадающем меню
    document.querySelectorAll('#langDropdown .flag').forEach(flag => {
        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (flag.classList.contains(key) || flag.classList.contains(`flag-${key.replace('flag-', '')}`)) {
                if (flag.textContent !== emoji) {
                    flag.textContent = emoji;
                    flag.innerHTML = emoji;
                }
                break;
            }
        }
    });
    
    // Убираем активный класс со всех опций
    document.querySelectorAll('#langDropdown .lang-option').forEach(opt => opt.classList.remove('active'));
    
    // Добавляем активный класс к выбранной опции
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Закрываем выпадающий список
    document.getElementById('langDropdown').classList.remove('show');
    
}

// Старая функция для обратной совместимости
function selectLanguage(lang, flagClass, name) {
    const flagEmojis = {
        'flag-ru': '🇷🇺',
        'flag-us': '🇺🇸', 
        'flag-tj': '🇹🇯',
        'flag-ir': '🇮🇷',
        'flag-de': '🇩🇪',
        'flag-cn': '🇨🇳'
    };
    selectLanguageNew(lang, flagClass, flagEmojis[flagClass] || '🏳️', name);
}


// Отель availability checker
function checkHotelAvailability() {
    const modal = document.getElementById('hotelAvailabilityModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeHotelModal() {
    const modal = document.getElementById('hotelAvailabilityModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function performHotelSearch() {
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guestCount').value;
    
    if (!checkIn || !checkOut) {
        alert('Пожалуйста, выберите даты заезда и выезда');
        return;
    }
    
    // Симуляция поиска отелей
    alert(`Поиск отелей:\nЗаезд: ${checkIn}\nВыезд: ${checkOut}\nГостей: ${guests}\n\nФункция будет доступна в ближайшее время.`);
}

// ✅ АРХИТЕКТУРНАЯ ЧИСТОТА: Карта инициализируется footer'ом, не home-page.js!

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Tour loading functions
async function loadTourBlocks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tour-blocks`);
        const result = await response.json();
        
        if (result.success) {
            // Сортируем блоки по sortOrder для правильного порядка отображения
            const sortedBlocks = result.data.sort((a, b) => a.sortOrder - b.sortOrder);
            
            for (const block of sortedBlocks) {
                await loadToursForBlock(block);
            }
        }
    } catch (error) {
        console.error('Error loading tour blocks:', error);
    }
}

async function loadToursForBlock(block) {
    try {
        const response = await fetch(`${API_BASE_URL}/tour-blocks/${block.id}/tours`);
        const result = await response.json();
        
        console.log(`Loading tours for block ${block.id}:`, result);
        
        if (result.success && result.data.length > 0) {
            renderTourBlock(block, result.data);
        } else {
            console.log(`No tours found for block ${block.id}`);
        }
    } catch (error) {
        console.error(`Error loading tours for block ${block.id}:`, error);
    }
}

function renderTourBlock(block, tours) {
    // Безопасная обработка названия блока
    let blockTitle;
    try {
        if (typeof block.title === 'string') {
            blockTitle = JSON.parse(block.title);
        } else {
            blockTitle = block.title || {};
        }
    } catch (e) {
        blockTitle = { ru: block.title || 'Блок туров', en: block.title || 'Tour Block' };
    }
    
    const blockId = `tour-block-${block.id}`;
    const carouselId = `carousel-${block.id}`;
    
    // Найдем контейнер для динамических блоков туров
    const tourBlocksContainer = document.getElementById('tour-blocks-container');
    
    if (!tourBlocksContainer) {
        console.error('Tour blocks container not found');
        return;
    }
    
    // Найдем существующую секцию или создадим новую
    let existingSection = document.getElementById(blockId);
    
    if (!existingSection) {
        // Создаем новую секцию в контейнере
        existingSection = document.createElement('section');
        existingSection.id = blockId;
        existingSection.className = 'py-16 bg-white';
        
        // Добавляем блоки в порядке поступления (уже отсортированы в loadTourBlocks)
        // Просто добавляем в конец контейнера
        
        // Добавляем блок в конец (блоки уже приходят в правильном порядке)
        tourBlocksContainer.appendChild(existingSection);
    }
    
    if (existingSection) {
        existingSection.innerHTML = `
            <div class="max-w-7xl mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
                    ${blockTitle.ru}
                </h2>
                
                <div class="tour-block-container">
                    <button class="carousel-button prev" onclick="scrollCarousel('${carouselId}', -1)" id="prev-${carouselId}">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    
                    <div class="tour-carousel" id="${carouselId}" onscroll="updateCarouselButtons('${carouselId}')">
                        ${tours.map(tour => renderTourCard(tour)).join('')}
                    </div>
                    
                    <button class="carousel-button next" onclick="scrollCarousel('${carouselId}', 1)" id="next-${carouselId}">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Initialize carousel buttons state  
        setTimeout(() => {
            updateCarouselButtons(carouselId);
            toggleCarouselButtons(carouselId, tours.length);
        }, 100);
    }
}

function renderTourCard(tour) {
    // Парсим JSON поля для корректного отображения
    let title, description;
    try {
        title = typeof tour.title === 'string' ? JSON.parse(tour.title) : tour.title;
        title = title.ru || title.en || 'Название не указано';
    } catch (e) {
        title = tour.title || 'Название не указано';
    }
    
    try {
        description = typeof tour.description === 'string' ? JSON.parse(tour.description) : tour.description;
        description = description.ru || description.en || 'Описание не указано';
    } catch (e) {
        description = tour.description || 'Описание не указано';
    }
    
    const shortDesc = tour.shortDesc || null;
    
    // Генерируем массив изображений для слайдшоу из реальных данных тура
    const tourImages = [];
    
    // Парсим строку с изображениями из базы данных
    if (tour.images) {
        try {
            const imageArray = typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images;
            if (Array.isArray(imageArray) && imageArray.length > 0) {
                tourImages.push(...imageArray);
            }
        } catch (e) {
            console.warn('Failed to parse tour images:', e);
        }
    }
    
    // Если нет изображений, используем placeholder
    if (tourImages.length === 0) {
        tourImages.push('/placeholder-tour.jpg'); // Placeholder если нет изображений
    }
    
    return `
        <div class="tour-card group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col h-full"
             onclick="window.location.href='tour-template.html?tour=${tour.id || 1}'"
             onmouseenter="startImageSlideshow(${tour.id})"
             onmouseleave="stopImageSlideshow(${tour.id})"
             data-tour-id="${tour.id}">
            <div class="relative overflow-hidden rounded-t-lg">
                <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center" id="tour-image-container-${tour.id}">
                    ${tourImages.length > 0 ? 
                        tourImages.map((imgSrc, index) => `
                            <img src="${imgSrc}" 
                                 alt="${title}" 
                                 class="tour-slide-image w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}" 
                                 data-slide-index="${index}"
                                 data-tour-id="${tour.id}"
                                 onerror="this.style.display='none';">
                        `).join('') :
                        `<div class="text-center p-4">
                            <svg class="w-12 h-12 mx-auto text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"/>
                            </svg>
                            <div class="text-sm font-medium text-blue-600">${title}</div>
                        </div>`
                    }
                </div>
                <button class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                ${tourImages.length > 1 ? `
                <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    ${tourImages.map((_, index) => `
                        <div class="w-2 h-2 rounded-full bg-white opacity-50 tour-slide-dot" 
                             data-tour-id="${tour.id}" 
                             data-slide-index="${index}"
                             ${index === 0 ? 'style="opacity: 1;"' : ''}></div>
                    `).join('')}
                </div>` : ''}
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <div class="text-xs text-gray-500 mb-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                    ${tour.city}, ${tour.country}
                </div>
                <!-- Тип тура (обязательно показываем) -->
                <div class="flex items-center text-blue-600 text-xs mb-2">
                    <span class="mr-1">🟢</span>
                    <span class="font-medium">${tour.format || tour.tourType || 'Групповой'}</span>
                </div>
                <!-- Категория тура (обязательно показываем) -->
                <div class="flex items-center text-xs mb-2" style="color: #3E3E3E;">
                    <span class="mr-1">🏷️</span>
                    <span class="font-medium">${tour.category && tour.category.name ? (tour.category.name.ru || tour.category.name.en || 'Категория') : 'Категория'}</span>
                </div>
                ${tour.rating ? `
                <div class="flex items-center text-green-600 text-xs mb-2">
                    <span class="mr-1">★</span>
                    <span class="font-semibold">${tour.rating}</span>
                    <span class="text-gray-500 ml-1">(${tour.reviewsCount || 0})</span>
                </div>` : ''}
                <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 flex-grow">
                    ${title}
                </h3>
                <div class="flex items-center justify-between mt-auto">
                    <div>
                        ${tour.originalPrice ? `
                            <div class="text-sm line-through text-gray-400 mb-1 price-display" data-original-price="${tour.originalPrice}">${tour.originalPrice} TJS</div>
                        ` : ''}
                        <div class="text-lg font-bold text-gray-900 tour-price price-display" data-original-price="${tour.price}">${tour.price} TJS</div>
                        <div class="converted-price text-sm text-gray-600 mt-1" style="display: none;"></div>
                        <div class="text-xs text-gray-500 mt-1">${tour.priceType}</div>
                    </div>
                    <button class="hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors" 
                            style="background-color: #3E3E3E;"
                            onclick="event.stopPropagation(); window.location.href='tour-template.html?id=${tour.id}'">
                        Бронировать
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Carousel Navigation Functions
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const cardWidth = 280 + 24; // card width + gap
    const scrollAmount = cardWidth * 3; // scroll 3 cards at a time
    
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function toggleCarouselButtons(carouselId, totalTours) {
    const prevBtn = document.getElementById(`prev-${carouselId}`);
    const nextBtn = document.getElementById(`next-${carouselId}`);
    
    if (!prevBtn || !nextBtn) return;
    
    // Show buttons only if there are more than 4 tours
    const showButtons = totalTours > 4;
    prevBtn.style.display = showButtons ? 'flex' : 'none';
    nextBtn.style.display = showButtons ? 'flex' : 'none';
}

function updateCarouselButtons(carouselId) {
    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(`prev-${carouselId}`);
    const nextBtn = document.getElementById(`next-${carouselId}`);
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollLeft = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    // Update previous button
    if (scrollLeft <= 10) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
    }
    
    // Update next button
    if (scrollLeft >= maxScroll - 10) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
}

// Hero Slider Functions
let currentSlideIndex = 0;
let slides = [];
let slideInterval;

async function loadSlides() {
    try {
        const response = await fetch(`${window.location.origin}/api/slides`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
            slides = data.data;
            renderSlides();
            initializeSlider();
        } else {
            console.log('No slides found, using default content');
        }
    } catch (error) {
        console.error('Error loading slides:', error);
    }
}

function renderSlides() {
    const container = document.getElementById('slidesContainer');
    const navigation = document.getElementById('sliderNavigation');
    
    if (!container || !navigation) return;

    // Создаем слайды
    container.innerHTML = slides.map((slide, index) => {
        const title = JSON.parse(slide.title || '{}');
        const description = JSON.parse(slide.description || '{}');
        const buttonText = slide.buttonText ? JSON.parse(slide.buttonText) : null;
        
        return `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" data-slide="${index}"
                 style="background-image: url('${slide.image || ''}'); ${!slide.image ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' : ''}">
                <div class="gradient-overlay absolute inset-0"></div>
                <div class="relative z-10 text-center max-w-4xl mx-auto px-6 flex items-center justify-center h-full">
                    <div>
                        <h1 class="text-6xl font-bold mb-6 text-white">
                            ${title.ru || title.en || 'Откройте красоту Таджикистана'}
                        </h1>
                        <p class="text-xl mb-8 max-w-2xl mx-auto text-white">
                            ${description.ru || description.en || 'Исследуйте захватывающие горы Памира, древние города Шёлкового пути и богатую культуру этой удивительной страны'}
                        </p>
                        ${slide.link && buttonText ? `
                            <a href="${slide.link}" class="inline-block bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                ${buttonText.ru || buttonText.en || 'Узнать больше'}
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Создаем точки навигации
    navigation.innerHTML = slides.map((_, index) => 
        `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`
    ).join('');

    // Показываем кнопки навигации если больше одного слайда
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    if (slides.length > 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

function initializeSlider() {
    if (slides.length <= 1) return;

    // Автопрокрутка слайдов
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);

    // Обработчики кнопок
    document.getElementById('prevSlide').onclick = prevSlide;
    document.getElementById('nextSlide').onclick = nextSlide;
}

function goToSlide(index) {
    if (index === currentSlideIndex) return;

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');

    // Скрываем текущий слайд
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');

    // Показываем новый слайд
    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    // Перезапускаем автопрокрутку
    clearInterval(slideInterval);
    if (slides.length > 1) {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
}

// Загружаем туры и слайды при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing...');
    
    // 🌐 ИНИЦИАЛИЗИРУЕМ ЯЗЫКОВУЮ СИСТЕМУ (ЦЕНТРАЛЬНАЯ i18n.js)
    if (window.i18n) {
        window.i18n.initializeLanguage();
        // 🔄 ПОСЛЕ ЗАГРУЗКИ ТУРОВ ПРИМЕНЯЕМ ДИНАМИЧЕСКИЕ ПЕРЕВОДЫ
        setTimeout(() => {
            const currentLang = window.i18n.currentLanguage();
            translateDynamicContent(currentLang);
            console.log(`🔄 Динамический контент инициализирован для языка: ${currentLang}`);
        }, 100); // Небольшая задержка для загрузки туров
    } else {
        console.warn('⚠️ i18n.js не загружен, используем fallback инициализацию');
    }
    
    // Сначала загружаем страны и города для фильтров
    await loadCountriesAndCities();
    
    loadTourBlocks();
    loadSlides();
    initializeCurrency();
    
    // КРИТИЧНО: Принудительно восстанавливаем эмодзи флаги
    forceEmojiFlags();
    
    // Инициализируем все обработчики событий
    initializeEventHandlers();
    
    // Повторно восстанавливаем флаги через небольшую задержку (на случай если CSS загружается позже)
    setTimeout(forceEmojiFlags, 1000);
    setTimeout(forceEmojiFlags, 3000);
});

function formatImageUrl(imageUrl) {
    if (!imageUrl) return '';
    
    if (imageUrl.startsWith('/objects/')) {
        // Object storage path - construct full URL
        return `${window.location.origin}${imageUrl}`;
    } else if (imageUrl.startsWith('http')) {
        // Full URL - use as is
        return imageUrl;
    } else {
        // Relative path - make it absolute
        return `${window.location.origin}/${imageUrl}`;
    }
}


// Глобальная система валют
let globalCurrency = 'TJS';
let exchangeRates = {
    TJS: { rate: 1, symbol: 'SM' },
    USD: { rate: 0.091, symbol: '$' },
    EUR: { rate: 0.084, symbol: '€' },
    RUB: { rate: 0.11, symbol: '₽' },
    CNY: { rate: 0.758, symbol: '¥' }
};

// Функции переключения валют
function toggleCurrencyDropdown() {
    const dropdown = document.getElementById('currencyDropdown');
    dropdown.classList.toggle('show');
    
    // Закрываем языковой dropdown если открыт
    const langDropdown = document.getElementById('langDropdown');
    if (langDropdown.classList.contains('show')) {
        langDropdown.classList.remove('show');
    }
}

function selectCurrency(currency, symbol) {
    globalCurrency = currency;
    
    // Обновляем кнопку селектора
    document.querySelector('.selected-currency').textContent = currency;
    
    // Обновляем активный элемент в dropdown
    document.querySelectorAll('#currencyDropdown .lang-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-currency="${currency}"]`).classList.add('active');
    
    // Скрываем dropdown
    document.getElementById('currencyDropdown').classList.remove('show');
    
    // Сохраняем в localStorage
    localStorage.setItem('selectedCurrency', currency);
    
    // Конвертируем все цены на странице
    convertAllPrices();
}

// Функция конвертации цен
function convertPrice(priceInTJS, targetCurrency) {
    if (!exchangeRates[targetCurrency]) return priceInTJS;
    return Math.round(priceInTJS * exchangeRates[targetCurrency].rate);
}

function convertAllPrices() {
    // Конвертируем цены в карточках туров
    document.querySelectorAll('.tour-card').forEach(card => {
        const priceElement = card.querySelector('.tour-price');
        const convertedPriceElement = card.querySelector('.converted-price');
        
        if (priceElement && priceElement.dataset.originalPrice) {
            const originalPrice = parseInt(priceElement.dataset.originalPrice);
            
            // Основная цена всегда в TJS
            priceElement.textContent = `${originalPrice} TJS`;
            
            if (convertedPriceElement) {
                if (globalCurrency === 'TJS') {
                    // Скрываем конвертированную цену если TJS выбран
                    convertedPriceElement.style.display = 'none';
                } else {
                    // Показываем конвертированную цену под основной
                    const convertedPrice = convertPrice(originalPrice, globalCurrency);
                    convertedPriceElement.textContent = `(${convertedPrice} ${globalCurrency})`;
                    convertedPriceElement.style.display = 'block';
                }
            }
        }
    });
    
    // Конвертируем другие цены на странице
    document.querySelectorAll('.price-display').forEach(element => {
        if (element.dataset.originalPrice) {
            const originalPrice = parseInt(element.dataset.originalPrice);
            if (globalCurrency === 'TJS') {
                element.textContent = `${originalPrice} TJS`;
            } else {
                const convertedPrice = convertPrice(originalPrice, globalCurrency);
                element.textContent = `${originalPrice} TJS (${convertedPrice} ${globalCurrency})`;
            }
        }
    });
}

// Загрузка курсов валют с сервера
async function loadExchangeRates() {
    try {
        const response = await fetch('/api/exchange-rates');
        const data = await response.json();
        
        if (data.success) {
            data.data.forEach(rate => {
                exchangeRates[rate.currency] = {
                    rate: parseFloat(rate.rate),
                    symbol: rate.symbol
                };
            });
            
            // Применяем конвертацию после загрузки курсов
            convertAllPrices();
        }
    } catch (error) {
        console.error('Ошибка загрузки курсов валют:', error);
    }
}

// JavaScript BACKUP: Принудительное восстановление эмодзи флагов
function forceEmojiFlags() {
    const flagMappings = {
        'flag-ru': '🇷🇺',
        'flag-us': '🇺🇸', 
        'flag-tj': '🇹🇯',
        'flag-ir': '🇮🇷',
        'flag-de': '🇩🇪',
        'flag-cn': '🇨🇳'
    };
    
    // Восстанавливаем эмодзи в ВСЕХ флагах
    document.querySelectorAll('.flag, .selected-flag').forEach(flag => {
        for (const [className, emoji] of Object.entries(flagMappings)) {
            if (flag.classList.contains(className)) {
                // Принудительно заменяем содержимое на эмодзи
                flag.textContent = emoji;
                flag.innerHTML = emoji;
                break;
            }
        }
    });
}

// Инициализация валютной системы
function initializeCurrency() {
    // Устанавливаем TJS как основную валюту по умолчанию
    globalCurrency = 'TJS';
    
    // Восстанавливаем выбранную валюту из localStorage только если это не первый визит
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && exchangeRates[savedCurrency] && savedCurrency !== 'TJS') {
        globalCurrency = savedCurrency;
        document.querySelector('.selected-currency').textContent = savedCurrency;
        document.querySelectorAll('#currencyDropdown .lang-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-currency="${savedCurrency}"]`)?.classList.add('active');
    } else {
        // Убеждаемся что TJS активен по умолчанию
        document.querySelector('.selected-currency').textContent = 'TJS';
        document.querySelectorAll('#currencyDropdown .lang-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-currency="TJS"]`)?.classList.add('active');
        localStorage.setItem('selectedCurrency', 'TJS');
    }
    
    // Загружаем актуальные курсы валют
    loadExchangeRates();
    
    // Обновляем отображение цен
    convertAllPrices();
}


// Закрытие dropdown при клике вне их
document.addEventListener('click', function(event) {
    const langDropdown = document.getElementById('languageDropdown');
    const currencyDropdown = document.getElementById('currencyDropdown');
    
    // Закрываем языковой dropdown
    if (langDropdown && !event.target.closest('.language-dropdown')) {
        langDropdown.classList.remove('show');
    }
    
    // Закрываем валютный dropdown
    if (currencyDropdown && !event.target.closest('.language-dropdown')) {
        currencyDropdown.classList.remove('show');
    }
});

// Функция инициализации всех обработчиков событий
function initializeEventHandlers() {
    console.log('Initializing event handlers...');
    
    // Обработчики для валютного селектора  
    const currencyButton = document.querySelector('button[onclick="toggleCurrencyDropdown()"]');
    if (currencyButton) {
        // Убираем onclick атрибут и добавляем event listener
        currencyButton.removeAttribute('onclick');
        currencyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Currency button clicked');
            toggleCurrencyDropdown();
        });
        console.log('Currency button handler added');
    }
    
    // Обработчики для опций валют
    document.querySelectorAll('#currencyDropdown .lang-option').forEach(option => {
        option.removeAttribute('onclick');
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const currency = this.getAttribute('data-currency');
            console.log('Currency selected:', currency);
            selectCurrency(currency, currency);
        });
    });
    
    // Обработчики для языкового селектора
    const langButton = document.querySelector('button[onclick="toggleLanguageDropdown()"]');
    if (langButton) {
        langButton.removeAttribute('onclick');
        langButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Language button clicked');
            toggleLanguageDropdown();
        });
    }
    
    // Обработчики для опций языков
    document.querySelectorAll('#langDropdown .lang-option').forEach(option => {
        option.removeAttribute('onclick');
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            const flagClass = this.querySelector('.flag').className.split(' ')[1]; // CSS класс для обратной совместимости 
            const flagEmoji = this.querySelector('.flag').textContent; // Берём эмодзи из span
            const name = this.querySelector('.lang-name').textContent;
            console.log('Language selected:', lang, 'Flag emoji:', flagEmoji);
            selectLanguageNew(lang, flagClass, flagEmoji, name);
        });
    });
    
    // Поиск туров
    const searchButton = document.querySelector('button[onclick="searchTours()"]');
    if (searchButton) {
        searchButton.removeAttribute('onclick');
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Search button clicked');
            searchTours();
        });
    }
    
    // Кнопка "Больше с Bunyod-Tour"
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CTA button clicked');
            // Прокрутка к турам
            document.querySelector('#main-content')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    console.log('All event handlers initialized');
}
