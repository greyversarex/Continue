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
  priceType?: string;
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
  priceType?: string;
  categoryId: number;
  tourBlockId?: number;
  country?: string;
  city?: string;
  format?: string;
  startDate?: string;
  endDate?: string;
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
  customerId: number;
  rating: number;
  text: string;
  isModerated: boolean;
  isApproved: boolean;
  tourId: number;
  customer?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
  };
  tour?: TourData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewData {
  customerId: number;
  rating: number;
  text: string;
  tourId: number;
}

export interface UpdateReviewData {
  isModerated?: boolean;
  isApproved?: boolean;
}

// Error types
export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
