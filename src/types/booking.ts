export interface TouristData {
  fullName: string;
  dateOfBirth: string;
}

export interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tourDate: string;
  tourists: TouristData[];
  wishes?: string;
  selectedHotelId?: number;
  selectedGuideId?: number;
  termsAccepted: boolean;
  paymentRulesAccepted: boolean;
}

export interface OrderData {
  orderNumber: string;
  customerId: number;
  tourId: number;
  hotelId?: number;
  guideId?: number;
  tourDate: string;
  tourists: TouristData[];
  wishes?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: 'payme' | 'click' | 'stripe' | 'paypal';
  receiptData?: any;
}

export interface PaymentData {
  orderId: number;
  amount: number;
  currency: string;
  method: 'payme' | 'click' | 'stripe' | 'paypal';
  returnUrl?: string;
  cancelUrl?: string;
}

export interface ReviewData {
  customerId: number;
  tourId: number;
  rating: number;
  text: string;
}

export interface HotelData {
  name: string; // JSON multilingual
  description?: string; // JSON multilingual
  images?: string[]; // Array of image URLs
  address?: string;
  rating?: number;
  amenities?: string[]; // Array of amenities
}

export interface GuideData {
  name: string; // JSON multilingual
  description?: string; // JSON multilingual
  photo?: string;
  languages: string[]; // Array of languages
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  experience?: number;
  rating?: number;
}