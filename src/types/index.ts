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

// BookingRequest types
export interface BookingRequestData {
  id: number;
  customerName: string;
  customerEmail: string;
  preferredDate: string;
  numberOfPeople: number;
  tourId: number;
  tour?: TourData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequestData {
  customerName: string;
  customerEmail: string;
  preferredDate: string;
  numberOfPeople: number;
  tourId: number;
}

// Review types
export interface ReviewData {
  id: number;
  authorName: string;
  rating: number;
  text: string;
  isModerated: boolean;
  tourId: number;
  tour?: TourData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewData {
  authorName: string;
  rating: number;
  text: string;
  tourId: number;
}

export interface UpdateReviewData {
  isModerated?: boolean;
}

// Error types
export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
