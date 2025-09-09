// Система переводов для HTML страниц
class TranslationSystem {
    constructor() {
        this.currentLanguage = 'ru';
        this.translations = {};
        this.supportedLanguages = ['ru', 'en', 'tj', 'fa', 'de', 'zh'];
        
        // Загружаем сохраненный язык из localStorage
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }
        
        this.init();
    }
    
    async init() {
        // Загружаем переводы для текущего языка
        await this.loadTranslations(this.currentLanguage);
        // Применяем переводы к странице
        this.applyTranslations();
        // Обновляем UI языкового селектора
        this.updateLanguageSelector();
    }
    
    async loadTranslations(language) {
        try {
            const response = await fetch(`/translations/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }
            this.translations[language] = await response.json();
            console.log(`✅ Переводы для ${language} загружены успешно`);
        } catch (error) {
            console.error(`❌ Ошибка загрузки переводов для ${language}:`, error);
            // Fallback на русский, если другой язык не загрузился
            if (language !== 'ru') {
                await this.loadTranslations('ru');
            }
        }
    }
    
    async changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.error(`Язык ${language} не поддерживается`);
            return;
        }
        
        this.currentLanguage = language;
        localStorage.setItem('selectedLanguage', language);
        
        // Загружаем переводы если их еще нет
        if (!this.translations[language]) {
            await this.loadTranslations(language);
        }
        
        // Применяем переводы
        this.applyTranslations();
        this.updateLanguageSelector();
        
        console.log(`🌐 Язык изменен на: ${language}`);
    }
    
    translate(key, fallback = '') {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback на русский
                translation = this.translations['ru'];
                for (const k of keys) {
                    if (translation && translation[k]) {
                        translation = translation[k];
                    } else {
                        return fallback || key;
                    }
                }
                break;
            }
        }
        
        return typeof translation === 'string' ? translation : fallback || key;
    }
    
    applyTranslations() {
        // Находим все элементы с атрибутом data-translate
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.translate(key);
            
            // Применяем перевод к нужному атрибуту
            const attribute = element.getAttribute('data-translate-attr') || 'textContent';
            
            if (attribute === 'placeholder') {
                element.placeholder = translation;
            } else if (attribute === 'title') {
                element.title = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        console.log(`🔄 Применены переводы для языка: ${this.currentLanguage}`);
    }
    
    updateLanguageSelector() {
        const languageData = {
            'ru': { flag: 'flag-ru', name: 'Русский' },
            'en': { flag: 'flag-us', name: 'English' },
            'tj': { flag: 'flag-tj', name: 'Тоҷикӣ' },
            'fa': { flag: 'flag-ir', name: 'فارسی' },
            'de': { flag: 'flag-de', name: 'Deutsch' },
            'zh': { flag: 'flag-cn', name: '中文' }
        };
        
        const currentLang = languageData[this.currentLanguage];
        if (!currentLang) return;
        
        // Обновляем кнопку селектора
        const selectedFlag = document.querySelector('.selected-flag');
        const selectedLang = document.querySelector('.selected-lang');
        
        if (selectedFlag) {
            selectedFlag.className = `selected-flag ${currentLang.flag}`;
        }
        if (selectedLang) {
            selectedLang.textContent = currentLang.name;
        }
        
        // Обновляем активный элемент в dropdown
        document.querySelectorAll('#langDropdown .lang-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-lang') === this.currentLanguage) {
                opt.classList.add('active');
            }
        });
    }
    
    getLanguageInfo() {
        return {
            current: this.currentLanguage,
            supported: this.supportedLanguages,
            hasTranslations: Object.keys(this.translations)
        };
    }
}

// Глобальная система переводов
let translationSystem;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    translationSystem = new TranslationSystem();
    // Делаем доступной глобально
    window.translationSystem = translationSystem;
});

// Улучшенная функция selectLanguage для интеграции с существующим кодом
async function selectLanguage(lang, flagClass, name) {
    console.log(`🌐 Переключение языка на: ${lang}`);
    
    if (translationSystem) {
        await translationSystem.changeLanguage(lang);
    }
    
    // Закрываем dropdown
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // Обновляем стрелку
    const arrow = document.querySelector('.dropdown-arrow');
    if (arrow) {
        arrow.classList.remove('open');
    }
}

// Функция для получения текста перевода в JavaScript
function t(key, fallback = '') {
    return translationSystem ? translationSystem.translate(key, fallback) : fallback;
}