// Utility functions for handling multilingual content

export type MultilingualContent = {
  en: string;
  ru: string;
  tj?: string;
};

export type FlexibleContent = string | MultilingualContent;

// Helper function to get content in current language
export const getContent = (content: FlexibleContent, language: string = 'en'): string => {
  if (typeof content === 'string') return content;
  if (content && typeof content === 'object') {
    return content[language as keyof typeof content] || content.en || content.ru || '';
  }
  return '';
};

// Helper to check if content is multilingual object
export const isMultilingualContent = (content: any): content is MultilingualContent => {
  return content && typeof content === 'object' && ('en' in content || 'ru' in content);
};

// Helper to safely get title content
export const getTitle = (tour: any, language: string = 'en'): string => {
  if (!tour || !tour.title) return 'Tour';
  return getContent(tour.title, language);
};

// Helper to safely get description content  
export const getDescription = (tour: any, language: string = 'en'): string => {
  if (!tour || !tour.description) return '';
  return getContent(tour.description, language);
};