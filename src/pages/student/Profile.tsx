
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Student } from '@/types/models';
import { Heart, User, Hash } from 'lucide-react';

const Profile = () => {
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            View your account information
          </p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-theme-purple text-white text-2xl">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription>Student Account</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium">{student.username}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Hash className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Student ID</p>
                        <p className="font-medium">{student.studentId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-theme-purple to-theme-pink text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">Current Heart Balance</p>
                      <div className="flex items-center mt-1">
                        <Heart className="h-8 w-8 mr-2" fill="white" />
                        <span className="text-4xl font-bold">{student.hearts}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-full p-8">
                      <Heart className="h-12 w-12 animate-heart-beat" fill="white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default Profile;
