// Утилиты для работы с многоязычным контентом
export interface MultilingualContent {
  ru: string;
  en: string;
  tj?: string;
  fa?: string;
  de?: string;
  zh?: string;
}

export const supportedLanguages = ['ru', 'en', 'tj', 'fa', 'de', 'zh'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

/**
 * Безопасное получение многоязычного контента с fallback
 */
export function getMultilingualContent(
  content: any, 
  language: SupportedLanguage = 'ru'
): string {
  // Если это уже строка (старый формат), возвращаем как есть
  if (typeof content === 'string') {
    try {
      // Попытка парсить JSON если это JSON-строка
      const parsed = JSON.parse(content);
      return parsed[language] || parsed.ru || parsed.en || content;
    } catch {
      // Если не JSON, возвращаем как есть
      return content;
    }
  }
  
  // Если это объект (новый JSON формат)
  if (content && typeof content === 'object') {
    return content[language] || content.ru || content.en || '';
  }
  
  return '';
}

/**
 * Создание многоязычного объекта из данных формы
 */
export function createMultilingualContent(data: {
  ru?: string;
  en?: string;
  tj?: string;
  fa?: string;
  de?: string;
  zh?: string;
}): MultilingualContent {
  return {
    ru: data.ru || '',
    en: data.en || '',
    tj: data.tj || '',
    fa: data.fa || '',
    de: data.de || '',
    zh: data.zh || ''
  };
}

/**
 * Получение контента с приоритетом новых полей над старыми
 */
export function getContentWithFallback(
  newField: any,
  oldField: any,
  language: SupportedLanguage = 'ru'
): string {
  // Приоритет: новое JSON поле -> старое поле -> пустая строка
  if (newField) {
    return getMultilingualContent(newField, language);
  }
  
  if (oldField) {
    return getMultilingualContent(oldField, language);
  }
  
  return '';
}

/**
 * Проверка, содержит ли поле многоязычный контент
 */
export function isMultilingualContent(content: any): boolean {
  if (!content || typeof content !== 'object') return false;
  
  // Проверяем наличие хотя бы одного из поддерживаемых языков
  return supportedLanguages.some(lang => content[lang]);
}

/**
 * Конвертация старого формата в новый многоязычный
 */
export function convertToMultilingual(
  oldContent: string,
  defaultLanguage: SupportedLanguage = 'ru'
): MultilingualContent {
  // Если это уже JSON объект
  try {
    const parsed = JSON.parse(oldContent);
    if (typeof parsed === 'object' && parsed[defaultLanguage]) {
      return {
        ru: parsed.ru || '',
        en: parsed.en || '',
        tj: parsed.tj || '',
        fa: parsed.fa || '',
        de: parsed.de || '',
        zh: parsed.zh || ''
      };
    }
  } catch {
    // Не JSON, создаем объект с дефолтным языком
  }
  
  const result: MultilingualContent = {
    ru: '',
    en: '',
    tj: '',
    fa: '',
    de: '',
    zh: ''
  };
  
  result[defaultLanguage] = oldContent;
  return result;
}

/**
 * Валидация многоязычного контента
 */
export function validateMultilingualContent(content: any): boolean {
  if (!content || typeof content !== 'object') return false;
  
  // Проверяем, что есть хотя бы русский или английский
  return !!(content.ru || content.en);
}

/**
 * Получение доступных языков для контента
 */
export function getAvailableLanguages(content: any): SupportedLanguage[] {
  if (!content || typeof content !== 'object') return [];
  
  return supportedLanguages.filter(lang => 
    content[lang] && content[lang].trim().length > 0
  );
}

/**
 * Форматирование для API ответа
 */
export function formatForAPI(item: any, language?: SupportedLanguage) {
  if (!item) return item;
  
  const result = { ...item };
  
  // Обрабатываем поля с многоязычным контентом
  const multilingualFields = [
    { new: 'titleMultilang', old: 'title' },
    { new: 'descriptionMultilang', old: 'description' },
    { new: 'shortDescMultilang', old: 'shortDesc' },
    { new: 'nameMultilang', old: 'name' }
  ];
  
  multilingualFields.forEach(({ new: newField, old: oldField }) => {
    if (result[newField] || result[oldField]) {
      if (language) {
        // Если указан язык, возвращаем строку
        result[oldField] = getContentWithFallback(
          result[newField], 
          result[oldField], 
          language
        );
        delete result[newField]; // Убираем JSON поле из ответа
      } else {
        // Если язык не указан, возвращаем объект со всеми языками
        const multilingualObj = result[newField] || 
          convertToMultilingual(result[oldField] || '');
        result[oldField] = multilingualObj;
        delete result[newField];
      }
    }
  });
  
  return result;
}