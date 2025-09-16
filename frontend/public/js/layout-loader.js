/**
 * Universal Layout Loader для динамической загрузки хедера и футера
 * Asynchronously loads _header.html and _footer.html into all pages
 */

class LayoutLoader {
    constructor() {
        this.headerLoaded = false;
        this.footerLoaded = false;
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadHeader(),
                this.loadFooter()
            ]);
            
            // После загрузки инициализируем интернационализацию
            this.initializeAfterLoad();
        } catch (error) {
            console.error('❌ Layout loading failed:', error);
        }
    }

    async loadHeader() {
        try {
            const response = await fetch('/_header.html');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const headerHTML = await response.text();
            
            // Вставляем хедер в начало body
            const headerContainer = document.createElement('div');
            headerContainer.innerHTML = headerHTML;
            document.body.insertBefore(headerContainer.firstElementChild, document.body.firstChild);
            
            this.headerLoaded = true;
            console.log('✅ Header loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load header:', error);
        }
    }

    async loadFooter() {
        try {
            const response = await fetch('/_footer.html');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const footerHTML = await response.text();
            
            // Вставляем футер в конец body
            const footerContainer = document.createElement('div');
            footerContainer.innerHTML = footerHTML;
            document.body.appendChild(footerContainer.firstElementChild);
            
            this.footerLoaded = true;
            console.log('✅ Footer loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load footer:', error);
        }
    }

    initializeAfterLoad() {
        // Принудительно устанавливаем английский язык по умолчанию
        this.setDefaultLanguage();
        
        // Инициализируем интернационализацию после загрузки layout
        if (typeof window.initializeI18n === 'function') {
            window.initializeI18n();
        }
        
        // Инициализируем dropdown функции
        this.initializeDropdowns();
        
        // Инициализируем языковые переключатели
        this.initializeLanguageSwitcher();
        
        // Инициализируем валютные переключатели
        this.initializeCurrencySwitcher();
        
        // Инициализируем карту в футере
        this.initializeMap();
        
        console.log('🎉 Layout initialization completed');
    }

    initializeDropdowns() {
        // Обработка выпадающих меню
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            const langDropdowns = document.querySelectorAll('.lang-dropdown-content');
            
            // Закрываем все выпадающие меню при клике вне их
            if (!e.target.closest('.dropdown') && !e.target.closest('.language-dropdown')) {
                dropdowns.forEach(dropdown => dropdown.style.display = 'none');
                langDropdowns.forEach(dropdown => dropdown.style.display = 'none');
            }
        });
    }

    initializeLanguageSwitcher() {
        // Создаем глобальные функции для переключения языка
        window.toggleLanguageDropdown = () => {
            const dropdown = document.getElementById('langDropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };

        window.switchSiteLanguage = (lang) => {
            if (typeof window.switchLanguage === 'function') {
                window.switchLanguage(lang);
            } else {
                // Fallback для страниц без i18n
                window.currentLanguage = lang;
                localStorage.setItem('selectedLanguage', lang);
                
                // Обновляем UI селектора
                this.updateLanguageSelector(lang);
            }
            
            // Закрываем dropdown
            const dropdown = document.getElementById('langDropdown');
            if (dropdown) dropdown.style.display = 'none';
        };
    }

    initializeCurrencySwitcher() {
        window.toggleCurrencyDropdown = () => {
            const dropdown = document.getElementById('currencyDropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };

        window.selectCurrency = (currency, symbol) => {
            // Обновляем отображение выбранной валюты
            const selectedCurrency = document.querySelector('.selected-currency');
            if (selectedCurrency) {
                selectedCurrency.textContent = currency;
            }
            
            // Сохраняем в localStorage
            localStorage.setItem('selectedCurrency', currency);
            
            // Закрываем dropdown
            const dropdown = document.getElementById('currencyDropdown');
            if (dropdown) dropdown.style.display = 'none';
            
            // Вызываем обработчик смены валюты если он существует
            if (typeof window.updateCurrency === 'function') {
                window.updateCurrency(currency);
            }
        };
    }

    updateLanguageSelector(lang) {
        const flags = {
            'en': '🇺🇸',
            'ru': '🇷🇺', 
            'tj': '🇹🇯'
        };
        
        const names = {
            'en': 'English',
            'ru': 'Русский',
            'tj': 'Тоҷикӣ'
        };
        
        const selectedFlag = document.querySelector('.selected-flag');
        const selectedLang = document.querySelector('.selected-lang');
        
        if (selectedFlag) selectedFlag.textContent = flags[lang] || flags['en'];
        if (selectedLang) selectedLang.textContent = names[lang] || names['en'];
    }

    setDefaultLanguage() {
        // 🚨 ПРИНУДИТЕЛЬНАЯ УСТАНОВКА АНГЛИЙСКОГО ЯЗЫКА ПО УМОЛЧАНИЮ
        localStorage.setItem('selectedLanguage', 'en'); // Принудительно сбрасываем на английский
        const savedLanguage = 'en'; // ВСЕГДА английский
        
        // Устанавливаем глобальную переменную
        window.currentLanguage = savedLanguage;
        
        // Обновляем селектор языка сразу
        this.updateLanguageSelector(savedLanguage);
        
        // Если есть функция переключения языка, вызываем её
        if (typeof window.switchLanguage === 'function') {
            window.switchLanguage(savedLanguage);
        } else if (typeof window.switchSiteLanguage === 'function') {
            window.switchSiteLanguage(savedLanguage);
        }
        
        console.log(`🌍 Default language set to: ${savedLanguage}`);
    }

    initializeMap() {
        // Инициализация карты в футере
        setTimeout(() => {
            const mapElement = document.getElementById('map');
            if (mapElement && typeof L !== 'undefined') {
                try {
                    const map = L.map('map').setView([38.5598, 68.7870], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
                    
                    L.marker([38.5598, 68.7870])
                        .addTo(map)
                        .bindPopup('Bunyod-Tour Office')
                        .openPopup();
                } catch (error) {
                    console.warn('⚠️ Map initialization failed:', error);
                }
            }
        }, 1000);
    }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.layoutLoader = new LayoutLoader();
});

// Для совместимости экспортируем класс
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutLoader;
}