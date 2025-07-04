import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Book, User, CartItem, Order, AuthState, Address, WishlistItem } from '../types';
import { mockBooks, mockOrders, mockUsers, mockWishlist } from '../data/mockData';

interface AppState {
  auth: AuthState;
  books: Book[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  users: User[];
  searchQuery: string;
  selectedGenre: string;
  isLoading: boolean;
  selectedDeliveryAddress: Address | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: Book }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Book }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_GENRE'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_DELIVERY_ADDRESS'; payload: Address }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: Address }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'APPROVE_SELLER'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string };

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  },
  books: mockBooks,
  cart: [],
  wishlist: [],
  orders: [],
  users: mockUsers,
  searchQuery: '',
  selectedGenre: 'All',
  isLoading: false,
  selectedDeliveryAddress: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      const userOrders = action.payload.role === 'user' 
        ? mockOrders.filter(order => order.userId === action.payload.id)
        : action.payload.role === 'seller'
        ? mockOrders.filter(order => order.sellerId === action.payload.id)
        : mockOrders;
      
      const userWishlist = action.payload.role === 'user'
        ? mockWishlist.filter(item => item.userId === action.payload.id)
        : [];

      return {
        ...state,
        auth: {
          user: action.payload,
          isAuthenticated: true,
          isLoading: false,
        },
        orders: userOrders,
        wishlist: userWishlist,
        selectedDeliveryAddress: action.payload.addresses?.find(addr => addr.id === action.payload.defaultAddressId) || null,
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
        },
        cart: [],
        orders: [],
        wishlist: [],
        selectedDeliveryAddress: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: action.payload,
        },
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.book.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.book.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { book: action.payload, quantity: 1 }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.book.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.book.id !== action.payload.bookId),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'ADD_TO_WISHLIST':
      const wishlistItem: WishlistItem = {
        id: `wishlist-${Date.now()}`,
        userId: state.auth.user!.id,
        book: action.payload,
        addedDate: new Date().toISOString(),
      };
      return {
        ...state,
        wishlist: [...state.wishlist, wishlistItem],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.book.id !== action.payload),
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_SELECTED_GENRE':
      return {
        ...state,
        selectedGenre: action.payload,
      };
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    case 'SET_DELIVERY_ADDRESS':
      return {
        ...state,
        selectedDeliveryAddress: action.payload,
      };
    case 'ADD_ADDRESS':
      if (!state.auth.user) return state;
      const updatedUserWithNewAddress = {
        ...state.auth.user,
        addresses: [...(state.auth.user.addresses || []), action.payload],
      };
      return {
        ...state,
        auth: {
          ...state.auth,
          user: updatedUserWithNewAddress,
        },
      };
    case 'UPDATE_ADDRESS':
      if (!state.auth.user) return state;
      const updatedUserWithUpdatedAddress = {
        ...state.auth.user,
        addresses: state.auth.user.addresses?.map(addr =>
          addr.id === action.payload.id ? action.payload : addr
        ) || [],
      };
      return {
        ...state,
        auth: {
          ...state.auth,
          user: updatedUserWithUpdatedAddress,
        },
        selectedDeliveryAddress: state.selectedDeliveryAddress?.id === action.payload.id 
          ? action.payload 
          : state.selectedDeliveryAddress,
      };
    case 'DELETE_ADDRESS':
      if (!state.auth.user) return state;
      const updatedUserWithDeletedAddress = {
        ...state.auth.user,
        addresses: state.auth.user.addresses?.filter(addr => addr.id !== action.payload) || [],
      };
      return {
        ...state,
        auth: {
          ...state.auth,
          user: updatedUserWithDeletedAddress,
        },
        selectedDeliveryAddress: state.selectedDeliveryAddress?.id === action.payload 
          ? null 
          : state.selectedDeliveryAddress,
      };
    case 'SET_DEFAULT_ADDRESS':
      if (!state.auth.user) return state;
      const updatedUserWithDefaultAddress = {
        ...state.auth.user,
        defaultAddressId: action.payload,
        addresses: state.auth.user.addresses?.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload,
        })) || [],
      };
      return {
        ...state,
        auth: {
          ...state.auth,
          user: updatedUserWithDefaultAddress,
        },
      };
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
      };
    case 'APPROVE_SELLER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload ? { ...user, isApproved: true } : user
        ),
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}