
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useStore } from '@/contexts/StoreContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingBag, UserCheck, Clock } from 'lucide-react';
import { HistoryItem, Student } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { getAllStudents } = useAuth();
  const { items } = useStore();
  const { getAllHistory } = useHistory();
  
  const students = getAllStudents();
  const history = getAllHistory();
  
  // Calculate stats
  const totalStudents = students.length;
  const totalHearts = students.reduce((sum, student) => sum + student.hearts, 0);
  const totalStoreItems = items.length;
  const recentActivities = history.slice(0, 5);
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'HEARTS_ADDED':
        return <Heart className="h-4 w-4 text-heart" />;
      case 'HEARTS_REMOVED':
        return <Heart className="h-4 w-4 text-destructive" />;
      case 'ITEM_PURCHASED':
        return <ShoppingBag className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your Heart Haven reward system</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hearts</CardTitle>
              <Heart className="h-4 w-4 text-heart" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHearts}</div>
              <p className="text-xs text-muted-foreground">
                Across all students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Items</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStoreItems}</div>
              <p className="text-xs text-muted-foreground">
                Available for purchase
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Hearts</CardTitle>
              <Heart className="h-4 w-4 text-heart" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStudents > 0 ? Math.round(totalHearts / totalStudents) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Per student
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              The latest actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  const student = students.find(s => s.id === activity.userId);
                  return (
                    <div key={activity.id} className="flex items-center">
                      <div className="mr-4">
                        {getActivityIcon(activity.actionType)}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">
                          {student?.name || 'Unknown user'}{' '}
                          {activity.actionType === 'HEARTS_ADDED' && 'earned hearts'}
                          {activity.actionType === 'HEARTS_REMOVED' && 'lost hearts'}
                          {activity.actionType === 'ITEM_PURCHASED' && 'purchased an item'}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.details}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity to display</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
