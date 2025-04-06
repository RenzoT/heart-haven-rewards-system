
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useStore } from '@/contexts/StoreContext';
import StudentLayout from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { Student } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getHistoryForUser } = useHistory();
  const { items } = useStore();
  
  const student = currentUser as Student;
  const history = getHistoryForUser(student.id);
  
  // Get featured store items (just a few examples)
  const featuredItems = items.slice(0, 3);
  
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
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome, {student.name}!</h1>
          <p className="text-muted-foreground">Here's your Heart Haven dashboard</p>
        </div>
        
        {/* Hearts Card */}
        <Card className="bg-gradient-to-r from-theme-purple to-theme-pink text-white">
          <CardHeader>
            <CardTitle>Your Hearts</CardTitle>
            <CardDescription className="text-white/70">
              Use them to purchase rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="h-12 w-12 mr-4 animate-heart-beat" fill="white" />
              <div className="text-5xl font-bold">{student.hearts}</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest hearts and purchases
              </CardDescription>
            </div>
            <Link to="/student/history">
              <Button variant="ghost" size="sm" className="gap-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="mr-4">
                      {getActivityIcon(activity.actionType)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">
                        {activity.actionType === 'HEARTS_ADDED' && `Earned ${activity.amount} hearts`}
                        {activity.actionType === 'HEARTS_REMOVED' && `Lost ${activity.amount} hearts`}
                        {activity.actionType === 'ITEM_PURCHASED' && activity.details}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">You don't have any activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Featured Store Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Featured Rewards</h2>
            <Link to="/student/store">
              <Button variant="outline" size="sm" className="gap-1">
                <span>View Store</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {featuredItems.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-lg font-bold">
                    <Heart className="h-5 w-5 mr-2 text-heart" fill="currentColor" />
                    {item.price}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
