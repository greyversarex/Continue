// Multilingual content interface
export interface MultilingualContent {
  ru: string;     // Russian
  en: string;     // English  
  tj?: string;    // Tajik (Точикӣ)
  fa?: string;    // Persian/Farsi (فارسی)
  de?: string;    // German (Deutsch)
  zh?: string;    // Chinese (中文)
}

// Category interface
export interface Category {
  id: number;
  name: MultilingualContent;
  _count?: {
    tours: number;
  };
}

// Tour interface matching the backend API response
export interface Tour {
  id: number;
  title: MultilingualContent;
  description: MultilingualContent;
  duration: string;
  price: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}