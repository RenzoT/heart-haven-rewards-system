
export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed and not stored directly
  role: UserRole;
  name: string;
}

export interface Student extends User {
  role: 'student';
  hearts: number;
  studentId: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
}

export type ActionType = 
  | 'HEARTS_ADDED' 
  | 'HEARTS_REMOVED' 
  | 'ITEM_PURCHASED' 
  | 'ITEM_ADDED' 
  | 'ITEM_EDITED' 
  | 'ITEM_REMOVED';

export interface HistoryItem {
  id: string;
  timestamp: string;
  userId: string;
  actionType: ActionType;
  details: string;
  amount?: number;
  itemId?: string;
}
