
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { StoreItem } from '../types/models';
import { useToast } from '@/components/ui/use-toast';

// Mock initial store items
const INITIAL_STORE_ITEMS: StoreItem[] = [
  {
    id: '1',
    name: 'Homework Pass',
    description: 'Skip one homework assignment without penalty',
    price: 20,
    imageUrl: '/homework-pass.png',
    available: true
  },
  {
    id: '2',
    name: 'Extra Computer Time',
    description: '15 minutes of extra computer time during free periods',
    price: 10,
    imageUrl: '/computer-time.png',
    available: true
  },
  {
    id: '3',
    name: 'Lunch with Teacher',
    description: 'Have lunch with your favorite teacher',
    price: 30,
    imageUrl: '/lunch-teacher.png',
    available: true
  }
];

interface StoreContextType {
  items: StoreItem[];
  addItem: (item: Omit<StoreItem, 'id'>) => string;
  updateItem: (id: string, updates: Partial<StoreItem>) => boolean;
  deleteItem: (id: string) => boolean;
  getItemById: (id: string) => StoreItem | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);
  const { toast } = useToast();

  const addItem = (item: Omit<StoreItem, 'id'>): string => {
    const id = String(Date.now());
    const newItem = { ...item, id };
    
    setItems(prev => [...prev, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to the store.`
    });
    
    return id;
  };

  const updateItem = (id: string, updates: Partial<StoreItem>): boolean => {
    let found = false;
    
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          found = true;
          return { ...item, ...updates };
        }
        return item;
      });
      
      return updated;
    });
    
    if (found) {
      toast({
        title: "Item Updated",
        description: "The store item has been updated."
      });
    }
    
    return found;
  };

  const deleteItem = (id: string): boolean => {
    let deleted = false;
    let itemName = "";
    
    setItems(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      if (itemToDelete) {
        itemName = itemToDelete.name;
        deleted = true;
      }
      return prev.filter(item => item.id !== id);
    });
    
    if (deleted) {
      toast({
        title: "Item Removed",
        description: `${itemName} has been removed from the store.`
      });
    }
    
    return deleted;
  };

  const getItemById = (id: string): StoreItem | undefined => {
    return items.find(item => item.id === id);
  };

  return (
    <StoreContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        getItemById
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
