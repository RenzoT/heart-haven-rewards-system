
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Student, Admin } from '../types/models';

// Mock data for initial users (in a real app, this would come from a database)
const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'student1',
    password: 'student123',
    role: 'student',
    name: 'John Smith',
    hearts: 50,
    studentId: 'S12345'
  } as Student,
  {
    id: '3',
    username: 'student2',
    password: 'student123',
    role: 'student',
    name: 'Jane Doe',
    hearts: 30,
    studentId: 'S12346'
  } as Student
];

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  addUser: (user: User) => void;
  addUsers: (users: User[]) => void;
  updateStudentHearts: (studentId: string, amount: number) => boolean;
  getStudentById: (id: string) => Student | undefined;
  getAllStudents: () => Student[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Check for saved user session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    // In a real app, this would call an API endpoint
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const addUsers = (newUsers: User[]) => {
    // First filter out any users that already exist with the same id
    const uniqueNewUsers = newUsers.filter(
      newUser => !users.some(existingUser => existingUser.id === newUser.id)
    );
    
    setUsers(prev => [...prev, ...uniqueNewUsers]);
  };

  const updateStudentHearts = (studentId: string, amount: number): boolean => {
    let success = false;
    
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === studentId && user.role === 'student') {
          const student = user as Student;
          // Don't allow negative hearts
          const newHearts = Math.max(0, student.hearts + amount);
          success = true;
          
          // If this is the current user, update the stored user data
          if (currentUser && currentUser.id === studentId) {
            const updatedUser = { ...student, hearts: newHearts };
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
          
          return { ...student, hearts: newHearts };
        }
        return user;
      });
    });
    
    return success;
  };

  const getStudentById = (id: string): Student | undefined => {
    const student = users.find(user => user.id === id && user.role === 'student');
    return student as Student | undefined;
  };

  const getAllStudents = (): Student[] => {
    return users.filter(user => user.role === 'student') as Student[];
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        users, 
        login, 
        logout, 
        addUser, 
        addUsers,
        updateStudentHearts,
        getStudentById,
        getAllStudents
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
