
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { HistoryItem, ActionType } from '../types/models';

// Generate a few initial history items
const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: '2',
    actionType: 'HEARTS_ADDED',
    details: 'Completed class assignment',
    amount: 10
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    userId: '2',
    actionType: 'ITEM_PURCHASED',
    details: 'Purchased Homework Pass',
    amount: 20,
    itemId: '1'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    userId: '3',
    actionType: 'HEARTS_ADDED',
    details: 'Helped classmate with project',
    amount: 5
  }
];

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (userId: string, actionType: ActionType, details: string, amount?: number, itemId?: string) => string;
  getHistoryForUser: (userId: string) => HistoryItem[];
  getAllHistory: () => HistoryItem[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY);

  const addHistoryItem = (
    userId: string, 
    actionType: ActionType, 
    details: string, 
    amount?: number, 
    itemId?: string
  ): string => {
    const id = String(Date.now());
    const timestamp = new Date().toISOString();
    
    const newHistoryItem: HistoryItem = {
      id,
      timestamp,
      userId,
      actionType,
      details,
      amount,
      itemId
    };
    
    setHistoryItems(prev => [newHistoryItem, ...prev]);
    return id;
  };

  const getHistoryForUser = (userId: string): HistoryItem[] => {
    return historyItems
      .filter(item => item.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getAllHistory = (): HistoryItem[] => {
    return [...historyItems].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  return (
    <HistoryContext.Provider
      value={{
        historyItems,
        addHistoryItem,
        getHistoryForUser,
        getAllHistory
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
