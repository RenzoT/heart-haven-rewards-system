
import React, { ReactNode } from 'react';
import StudentNav from './StudentNav';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <StudentNav />
      </div>
      <div className="flex-grow overflow-auto bg-background">
        <main className="container py-8 px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
