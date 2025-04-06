
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Heart, History, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Student } from '@/types/models';

const StudentNav: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const student = currentUser as Student;
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/student/dashboard', 
      icon: <Heart className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'Store', 
      path: '/student/store', 
      icon: <ShoppingBag className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'History', 
      path: '/student/history', 
      icon: <History className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'Profile', 
      path: '/student/profile', 
      icon: <User className="mr-2 h-4 w-4" /> 
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-theme-purple p-4 text-white">
      <div className="flex items-center mb-8 px-2">
        <Heart className="h-8 w-8 text-white mr-2" />
        <div>
          <h1 className="font-bold text-lg">Heart Haven</h1>
          <p className="text-xs opacity-75">Student Portal</p>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-3 mb-6">
        <p className="text-sm opacity-75">Your Hearts</p>
        <div className="flex items-center mt-1">
          <Heart className="h-5 w-5 text-heart-light mr-2" fill="currentColor" />
          <span className="text-xl font-bold">{student?.hearts || 0}</span>
        </div>
      </div>
      
      <div className="flex-grow">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm transition-colors rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="pt-4 border-t border-white/20">
        <div className="px-4 py-2 mb-4">
          <p className="font-medium">{currentUser?.name}</p>
          <p className="text-xs text-white/70">Student ID: {student?.studentId}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-white border-white/20 hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default StudentNav;
