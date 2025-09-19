/**
 * Universal Layout Loader для динамической загрузки хедера и футера
 * Asynchronously loads _header.html and _footer.html into all pages
 * Standardized version with idempotence guard and layout:ready event
 */

class LayoutLoader {
    constructor() {
        // Global idempotence guard
        if (window.layoutInitialized) {
            console.warn('⚠️ LayoutLoader already initialized, skipping...');
            return;
        }
        
        this.headerLoaded = false;
        this.footerLoaded = false;
        this.API_BASE = window.location.origin;
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
            
            // 🎯 УМНАЯ ВСТАВКА: используем контейнер если есть, иначе начало body
            const headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = headerHTML;
            } else {
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = headerHTML;
                document.body.insertBefore(tempContainer.firstElementChild, document.body.firstChild);
            }
            
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
            
            // 🎯 УМНАЯ ВСТАВКА: используем контейнер если есть, иначе конец body
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = footerHTML;
            } else {
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = footerHTML;
                document.body.appendChild(tempContainer.firstElementChild);
            }
            
            this.footerLoaded = true;
            console.log('✅ Footer loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load footer:', error);
        }
    }

    initializeAfterLoad() {
        try {
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
            
            // Feature-detected map initialization (only if container exists)
            this.initializeMapIfPresent();
            
            // Mark as fully initialized
            window.layoutInitialized = true;
            
            // Dispatch layout:ready event for page scripts
            const layoutReadyEvent = new CustomEvent('layout:ready', {
                detail: { 
                    headerLoaded: this.headerLoaded, 
                    footerLoaded: this.footerLoaded,
                    apiBase: this.API_BASE
                }
            });
            document.dispatchEvent(layoutReadyEvent);
            
            console.log('🎉 Layout initialization completed');
            
        } catch (error) {
            console.error('❌ Layout initialization failed:', error);
        }
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
            'ru': '🇷🇺'
        };
        
        const names = {
            'en': 'English',
            'ru': 'Русский'
        };
        
        const selectedFlag = document.querySelector('.selected-flag');
        const selectedLang = document.querySelector('.selected-lang');
        
        if (selectedFlag) selectedFlag.textContent = flags[lang] || flags['en'];
        if (selectedLang) selectedLang.textContent = names[lang] || names['en'];
    }

    setDefaultLanguage() {
        // 🎯 УМНАЯ ЛОГИКА: EN по умолчанию, но сохраняем выбор пользователя
        let savedLanguage = localStorage.getItem('selectedLanguage');
        
        // Если язык не сохранен, устанавливаем английский как дефолтный
        if (!savedLanguage || !['en', 'ru'].includes(savedLanguage)) {
            savedLanguage = 'en';
            localStorage.setItem('selectedLanguage', 'en');
        }
        
        // Применяем выбранный/дефолтный язык
        document.documentElement.lang = savedLanguage;
        window.currentLanguage = savedLanguage;
        
        // Обновляем селектор языка
        this.updateLanguageSelector(savedLanguage);
        
        // Применяем язык через системы переводов
        if (typeof window.switchLanguage === 'function') {
            window.switchLanguage(savedLanguage);
        } else if (typeof window.switchSiteLanguage === 'function') {
            window.switchSiteLanguage(savedLanguage);
        }
        if (typeof window.initializeI18n === 'function') {
            window.initializeI18n(savedLanguage);
        }
        
        console.info(`🌍 Language set to: ${savedLanguage}`);
    }

    initializeMapIfPresent() {
        // Feature detection: Only initialize map if container exists
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.log('📍 Map container not found, skipping map initialization');
            return;
        }

        // Check for Leaflet library
        if (typeof L === 'undefined') {
            console.warn('⚠️ Leaflet library not found, map initialization skipped');
            return;
        }

        setTimeout(() => {
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
                    
                console.log('🗺️ Map initialized successfully');
            } catch (error) {
                console.warn('⚠️ Map initialization failed:', error);
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