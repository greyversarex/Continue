// Multilingual content interface
export interface MultilingualContent {
  en: string;
  ru: string;
  tj?: string;
}

// Content can be either string or multilingual object
export type FlexibleContent = string | MultilingualContent;

// Category interface
export interface Category {
  id: number;
  name: FlexibleContent;
  _count?: {
    tours: number;
  };
}

// Tour interface matching the backend API response
export interface Tour {
  id: number;
  title: FlexibleContent;
  description: FlexibleContent;
  duration: string;
  price: string;
  categoryId: number;
  category?: Category;
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