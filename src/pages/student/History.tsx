
import React from 'react';
import { useHistory } from '@/contexts/HistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import StudentLayout from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingBag, Clock } from 'lucide-react';
import { HistoryItem, Student } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';

const History = () => {
  const { currentUser } = useAuth();
  const { getHistoryForUser } = useHistory();
  
  const student = currentUser as Student;
  const history = getHistoryForUser(student.id);
  
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
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const groupHistoryByDate = () => {
    const grouped: { [key: string]: HistoryItem[] } = {};
    
    history.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    
    return grouped;
  };
  
  const groupedHistory = groupHistoryByDate();
  const dates = Object.keys(groupedHistory).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Activity History</h1>
          <p className="text-muted-foreground">
            Track your hearts earned and rewards purchased
          </p>
        </div>
        
        {dates.length > 0 ? (
          dates.map(date => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">{new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedHistory[date].map((item) => (
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
                            {item.actionType === 'HEARTS_ADDED' && 'Hearts Earned'}
                            {item.actionType === 'HEARTS_REMOVED' && 'Hearts Lost'}
                            {item.actionType === 'ITEM_PURCHASED' && 'Item Purchased'}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{item.details}</p>
                        {item.amount && (
                          <div className="flex items-center mt-2">
                            <Heart className="h-3 w-3 mr-1 text-heart" fill="currentColor" />
                            <span className="text-sm">{item.amount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">You don't have any activity history yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
};

export default History;
