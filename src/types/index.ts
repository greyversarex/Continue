// Multilingual content type
export interface MultilingualContent {
  en: string;
  ru: string;
}

// Category types
export interface CategoryData {
  id: number;
  name: MultilingualContent;
}

export interface CreateCategoryData {
  name: MultilingualContent;
}

// Tour types
export interface TourData {
  id: number;
  title: MultilingualContent;
  description: MultilingualContent;
  duration: string;
  price: string;
  categoryId: number;
  category?: CategoryData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTourData {
  title: MultilingualContent;
  description: MultilingualContent;
  duration: string;
  price: string;
  categoryId: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error types
export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
