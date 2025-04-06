
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import StudentLayout from '@/components/layout/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Search } from 'lucide-react';
import { StoreItem, Student } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Store = () => {
  const { items } = useStore();
  const { currentUser, updateStudentHearts } = useAuth();
  const { addHistoryItem } = useHistory();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  
  const student = currentUser as Student;
  
  const availableItems = items.filter(item => item.available);
  const filteredItems = availableItems.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePurchase = () => {
    if (!selectedItem) return;
    
    if (student.hearts < selectedItem.price) {
      toast({
        title: "Not enough hearts",
        description: `You need ${selectedItem.price - student.hearts} more hearts to purchase this item.`,
        variant: "destructive"
      });
      setIsPurchaseDialogOpen(false);
      return;
    }
    
    const success = updateStudentHearts(student.id, -selectedItem.price);
    
    if (success) {
      addHistoryItem(
        student.id,
        'ITEM_PURCHASED',
        `Purchased "${selectedItem.name}"`,
        selectedItem.price,
        selectedItem.id
      );
      
      toast({
        title: "Purchase Successful",
        description: `You have purchased "${selectedItem.name}" for ${selectedItem.price} hearts.`,
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsPurchaseDialogOpen(false);
  };
  
  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards Store</h1>
          <p className="text-muted-foreground">
            Spend your hard-earned hearts on cool rewards!
          </p>
        </div>
        
        {/* Current Hearts Status */}
        <Card className="bg-gradient-to-r from-theme-purple to-theme-pink text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Your Heart Balance</p>
                <div className="flex items-center mt-1">
                  <Heart className="h-6 w-6 mr-2" fill="white" />
                  <span className="text-3xl font-bold">{student.hearts}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">Available Items</p>
                <p className="text-3xl font-bold">{availableItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for rewards..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Store Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden card-hover">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-heart" fill="currentColor" />
                  <span className="text-xl font-bold">{item.price}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={student.hearts >= item.price ? "default" : "outline"}
                  disabled={student.hearts < item.price}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsPurchaseDialogOpen(true);
                  }}
                >
                  {student.hearts >= item.price ? "Purchase" : "Not enough hearts"}
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">No rewards found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Purchase Confirmation Dialog */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Are you sure you want to purchase "{selectedItem?.name}" for {selectedItem?.price} hearts?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Your current balance:</p>
                  <div className="flex items-center mt-1">
                    <Heart className="h-4 w-4 mr-1 text-heart" fill="currentColor" />
                    <span className="font-bold">{student.hearts}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Balance after purchase:</p>
                  <div className="flex items-center justify-end mt-1">
                    <Heart className="h-4 w-4 mr-1 text-heart" fill="currentColor" />
                    <span className="font-bold">{selectedItem ? student.hearts - selectedItem.price : student.hearts}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePurchase}>
                Confirm Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
};

export default Store;
