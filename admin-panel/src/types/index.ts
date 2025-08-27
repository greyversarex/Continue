export interface Tour {
  id: number;
  title: string;
  description: string;
  country: string;
  price: string;
  category: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  tour_id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'agent' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    admin: {
      id: number;
      username: string;
      fullName: string;
      role: string;
    };
  };
  message: string;
}