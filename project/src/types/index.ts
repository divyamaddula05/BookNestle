export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isbn: string;
  publishedDate: string;
  pages: number;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  featured?: boolean;
  bestseller?: boolean;
  sellerId: string;
  sellerName: string;
  stock: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  bookId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'seller' | 'admin';
  businessName?: string; // For sellers
  addresses?: Address[];
  defaultAddressId?: string;
  preferences: {
    favoriteGenres: string[];
    notifications: boolean;
  };
  isApproved?: boolean; // For sellers
  joinDate: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  book: Book;
  addedDate: string;
}

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery?: string;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SellerStats {
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSellers: number;
}