
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, Heart, History, Users, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AdminNav: React.FC = () => {
  const { logout, currentUser } = useAuth();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <Heart className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'Students', 
      path: '/admin/students', 
      icon: <Users className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'Manage Store', 
      path: '/admin/store', 
      icon: <Store className="mr-2 h-4 w-4" /> 
    },
    { 
      name: 'History', 
      path: '/admin/history', 
      icon: <History className="mr-2 h-4 w-4" /> 
    },
  ];

  return (
    <Card className="flex flex-col h-screen bg-theme-purple p-4 text-white">
      <div className="flex items-center mb-8 px-2">
        <Heart className="h-8 w-8 text-white mr-2" />
        <div>
          <h1 className="font-bold text-lg">Heart Haven</h1>
          <p className="text-xs opacity-75">Admin Panel</p>
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
          <p className="text-xs text-white/70">Administrator</p>
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
    </Card>
  );
};

export default AdminNav;
