
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import { Pencil, Trash2, Plus, Search, Mail } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  registrationDate: string;
  lastLogin: string;
}

// Mock users data
const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    registrationDate: "2023-01-15",
    lastLogin: "2023-04-20"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "customer",
    status: "active",
    registrationDate: "2023-02-08",
    lastLogin: "2023-04-18"
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "customer",
    status: "inactive",
    registrationDate: "2023-03-20",
    lastLogin: "2023-03-22"
  }
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'customer'>('customer');
  const [userStatus, setUserStatus] = useState<'active' | 'inactive'>('active');
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "customer",
    status: "active"
  });
  const [isEditing, setIsEditing] = useState(false);

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDialog = () => {
    setCurrentUser({
      name: "",
      email: "",
      role: "customer",
      status: "active"
    });
    setUserRole('customer');
    setUserStatus('active');
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setUserStatus(user.status);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    const updatedUser = {
      ...currentUser,
      role: userRole,
      status: userStatus,
    };

    if (isEditing) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...updatedUser as User } : user
      ));
      
      toast({
        title: "User updated",
        description: `${updatedUser.name} has been updated successfully.`
      });
    } else {
      // Add new user
      const newUser = {
        ...updatedUser,
        id: Math.max(...users.map(u => u.id)) + 1,
        registrationDate: new Date().toISOString().substring(0, 10),
        lastLogin: new Date().toISOString().substring(0, 10)
      } as User;
      
      setUsers([...users, newUser]);
      
      toast({
        title: "User added",
        description: `${newUser.name} has been added successfully.`
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users Management</h1>
          
          <Button onClick={openAddDialog} className="flex items-center">
            <Plus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredUsers.length} users
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{user.registrationDate}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => {
                            toast({
                              title: "Email sent",
                              description: `An email has been sent to ${user.name}.`
                            })
                          }}
                        >
                          <Mail size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditDialog(user)}
                          className="mr-2"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the user details below." : "Fill in the user details below to add a new user."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentUser.email}
                onChange={handleInputChange}
                placeholder="e.g. john.doe@example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={userRole} onValueChange={(value) => setUserRole(value as 'admin' | 'customer')}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={userStatus} onValueChange={(value) => setUserStatus(value as 'active' | 'inactive')}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label>Account Info</Label>
                <div className="text-sm text-gray-500">
                  <p>Registration Date: {currentUser.registrationDate}</p>
                  <p>Last Login: {currentUser.lastLogin}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUser}>{isEditing ? "Update User" : "Add User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
