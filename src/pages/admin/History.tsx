
import React, { useState } from 'react';
import { useHistory } from '@/contexts/HistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingBag, Search, Filter } from 'lucide-react';
import { HistoryItem, Student } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';

const History = () => {
  const { getAllHistory } = useHistory();
  const { getAllStudents } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const history = getAllHistory();
  const students = getAllStudents();
  
  const filteredHistory = history.filter(item => {
    const student = students.find(s => s.id === item.userId);
    const studentName = student?.name || '';
    
    return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.details.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
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
        return <Heart className="h-5 w-5 text-heart" />;
      case 'HEARTS_REMOVED':
        return <Heart className="h-5 w-5 text-destructive" />;
      case 'ITEM_PURCHASED':
        return <ShoppingBag className="h-5 w-5 text-primary" />;
      case 'ITEM_ADDED':
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case 'ITEM_EDITED':
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case 'ITEM_REMOVED':
        return <ShoppingBag className="h-5 w-5 text-destructive" />;
      default:
        return <Heart className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const getStudentName = (userId: string): string => {
    const student = students.find(s => s.id === userId);
    return student ? student.name : 'Unknown User';
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity History</h1>
          <p className="text-muted-foreground">
            A complete log of all actions in the Heart Haven system
          </p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by student name or details..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
            <CardDescription>
              Showing {filteredHistory.length} activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="bg-muted rounded-full p-3 mr-4">
                    {getActivityIcon(item.actionType)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">
                        {item.actionType === 'HEARTS_ADDED' && 'Hearts Added'}
                        {item.actionType === 'HEARTS_REMOVED' && 'Hearts Removed'}
                        {item.actionType === 'ITEM_PURCHASED' && 'Item Purchased'}
                        {item.actionType === 'ITEM_ADDED' && 'Item Added to Store'}
                        {item.actionType === 'ITEM_EDITED' && 'Item Updated'}
                        {item.actionType === 'ITEM_REMOVED' && 'Item Removed from Store'}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{item.details}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        {getStudentName(item.userId)}
                      </span>
                      {item.amount && (
                        <div className="text-sm flex items-center">
                          <Heart className="h-3 w-3 mr-1 text-heart" fill="currentColor" />
                          {item.amount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No activity records found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default History;
