
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/contexts/HistoryContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Minus, Upload, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Student, User } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';

const Students = () => {
  const { getAllStudents, updateStudentHearts, addUsers } = useAuth();
  const { addHistoryItem } = useHistory();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [heartAmount, setHeartAmount] = useState('5');
  const [reason, setReason] = useState('');
  const [isAddingHearts, setIsAddingHearts] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const students = getAllStudents();
  const filteredStudents = students.filter(
    student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
    setHeartAmount('5');
    setReason('');
  };
  
  const handleHeartsSubmit = () => {
    if (!selectedStudent || !reason) return;
    
    const amount = parseInt(heartAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number.",
        variant: "destructive"
      });
      return;
    }
    
    const finalAmount = isAddingHearts ? amount : -amount;
    
    const success = updateStudentHearts(selectedStudent.id, finalAmount);
    
    if (success) {
      addHistoryItem(
        selectedStudent.id,
        isAddingHearts ? 'HEARTS_ADDED' : 'HEARTS_REMOVED',
        reason,
        Math.abs(finalAmount)
      );
      
      toast({
        title: isAddingHearts ? "Hearts Added" : "Hearts Removed",
        description: `${Math.abs(finalAmount)} hearts ${isAddingHearts ? 'added to' : 'removed from'} ${selectedStudent.name}'s account.`
      });
      
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update hearts. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvData(evt.target?.result as string);
      };
      reader.readAsText(file);
    }
  };
  
  const handleImportStudents = () => {
    if (!csvData) return;
    
    setIsProcessingCsv(true);
    
    try {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          // Convert CSV data to Student objects
          const newStudents = results.data
            .filter((row: any) => row.name && row.studentId && row.username && row.password)
            .map((row: any, index: number) => {
              return {
                id: `imported_${Date.now()}_${index}`,
                username: row.username,
                password: row.password,
                role: 'student' as const,
                name: row.name,
                studentId: row.studentId,
                hearts: parseInt(row.hearts) || 0
              };
            });
          
          if (newStudents.length > 0) {
            addUsers(newStudents);
            
            toast({
              title: "Students Imported",
              description: `Successfully imported ${newStudents.length} students.`,
              variant: "default"
            });
            
            setImportDialogOpen(false);
          } else {
            toast({
              title: "Import Failed",
              description: "No valid student data found in the CSV file.",
              variant: "destructive"
            });
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: "Import Error",
            description: "Failed to parse the CSV file. Please check the format.",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error('CSV import error:', error);
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingCsv(false);
      setCsvData(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Students</h1>
          <p className="text-muted-foreground">
            View and manage student accounts and adjust heart balances
          </p>
        </div>
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-auto">
            <Input 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>
          
          <Button onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import Students
          </Button>
        </div>
        
        {/* Students List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="overflow-hidden card-hover">
              <CardHeader className="pb-2">
                <CardTitle>{student.name}</CardTitle>
                <CardDescription>ID: {student.studentId}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 mr-2 text-heart" fill="currentColor" />
                  <span className="text-xl font-bold">{student.hearts}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsAddingHearts(true);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsAddingHearts(false);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Minus className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredStudents.length === 0 && (
            <div className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Hearts Dialog */}
        {selectedStudent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isAddingHearts ? 'Add Hearts' : 'Remove Hearts'} - {selectedStudent.name}
                </DialogTitle>
                <DialogDescription>
                  Current balance: {selectedStudent.hearts} hearts
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={heartAmount}
                    onChange={(e) => setHeartAmount(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why are you adjusting hearts?"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleHeartsSubmit}>
                  {isAddingHearts ? 'Add Hearts' : 'Remove Hearts'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Students</DialogTitle>
              <DialogDescription>
                Upload a CSV file with student data. The file should include columns for name, studentId, username, password, and optionally hearts.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              
              {csvData && (
                <div className="px-1">
                  <Check className="h-4 w-4 text-green-500 inline mr-2" />
                  <span className="text-sm text-green-500">CSV file ready for import</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Expected format:</p>
                <code className="bg-muted p-1 rounded">
                  name,studentId,username,password,hearts
                </code>
                <p className="mt-1">Example: John Doe,S12345,john,pass123,10</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleImportStudents}
                disabled={!csvData || isProcessingCsv}
              >
                {isProcessingCsv ? "Importing..." : "Import Students"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Students;
