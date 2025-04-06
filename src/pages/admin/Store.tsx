
import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Heart, Pencil, Trash, Plus, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StoreItem } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';

const Store = () => {
  const { items, addItem, updateItem, deleteItem } = useStore();
  const { addHistoryItem } = useHistory();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '10',
    imageUrl: '',
    available: true
  });
  
  const filteredItems = items.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, available: checked }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '10',
      imageUrl: '',
      available: true
    });
  };
  
  const handleAddItem = () => {
    const price = parseInt(formData.price);
    
    if (!formData.name || !formData.description || isNaN(price) || price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    const newItemId = addItem({
      name: formData.name,
      description: formData.description,
      price,
      imageUrl: formData.imageUrl || undefined,
      available: formData.available
    });
    
    if (currentUser) {
      addHistoryItem(
        currentUser.id,
        'ITEM_ADDED',
        `Added "${formData.name}" to the store`
      );
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  const handleEditItem = () => {
    if (!selectedItem) return;
    
    const price = parseInt(formData.price);
    
    if (!formData.name || !formData.description || isNaN(price) || price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    const success = updateItem(selectedItem.id, {
      name: formData.name,
      description: formData.description,
      price,
      imageUrl: formData.imageUrl || undefined,
      available: formData.available
    });
    
    if (success && currentUser) {
      addHistoryItem(
        currentUser.id,
        'ITEM_EDITED',
        `Updated "${formData.name}" in the store`
      );
    }
    
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    
    const success = deleteItem(selectedItem.id);
    
    if (success && currentUser) {
      addHistoryItem(
        currentUser.id,
        'ITEM_REMOVED',
        `Removed "${selectedItem.name}" from the store`
      );
    }
    
    setIsDeleteDialogOpen(false);
  };
  
  const openEditDialog = (item: StoreItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl || '',
      available: item.available
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (item: StoreItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Store</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove items in the reward store
          </p>
        </div>
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto">
            <Input 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>
          
          <Button onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
        
        {/* Store Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`overflow-hidden card-hover ${!item.available ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  {!item.available && (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                      Unavailable
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-heart" fill="currentColor" />
                  <span className="text-xl font-bold">{item.price}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => openDeleteDialog(item)}
                >
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">No items found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Add Item Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store Item</DialogTitle>
              <DialogDescription>
                Create a new reward that students can purchase with hearts
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Homework Pass"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the reward..."
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (Hearts)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="available">Available for purchase</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Store Item</DialogTitle>
              <DialogDescription>
                Update the details of this reward item
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (Hearts)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-available"
                  checked={formData.available}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="edit-available">Available for purchase</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditItem}>
                Update Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Store Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Store;
