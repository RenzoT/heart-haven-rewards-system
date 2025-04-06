
import React, { ReactNode } from 'react';
import AdminNav from './AdminNav';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <AdminNav />
      </div>
      <div className="flex-grow overflow-auto bg-background">
        <main className="container py-8 px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
