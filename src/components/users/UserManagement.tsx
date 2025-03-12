import React, { useState, useEffect } from "react";
import InitializeDatabase from "../InitializeDatabase";
import AvatarSelector from "./AvatarSelector";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  UserPlus,
  UserCog,
  Shield,
  Key,
  Mail,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Form schema for adding/editing users
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["owner", "worker", "technician"], {
    required_error: "Please select a role",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status",
  }),
  permissions: z.array(z.string()).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "worker" | "technician";
  status: "active" | "inactive";
  avatar?: string;
  dateAdded: string;
  permissions: string[];
}

interface UserManagementProps {
  users?: User[];
  onAddUser?: (user: UserFormValues) => void;
  onEditUser?: (id: string, user: UserFormValues) => void;
  onDeleteUser?: (id: string) => void;
  onUpdateStatus?: (id: string, status: "active" | "inactive") => void;
}

// Direct Supabase integration
const addUserToSupabase = async (userData) => {
  try {
    console.log("Inserting user into Supabase:", userData);

    // First check if the table exists
    const { error: tableCheckError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (tableCheckError) {
      console.error("Table check error:", tableCheckError);
      // If table doesn't exist, we need to create it
      if (
        tableCheckError.code === "PGRST116" ||
        tableCheckError.message.includes("does not exist")
      ) {
        console.log("Users table does not exist, initializing database first");
        // Initialize database first
        const initDb = new InitializeDatabase();
        await initDb.initializeDatabase();
      } else {
        throw tableCheckError;
      }
    }

    // Now insert the user
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight`,
        farm_id: "1", // Default farm ID
        permissions: userData.permissions || [],
      })
      .select();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    console.log("User added successfully:", data);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error adding user to Supabase:", error);
    return { success: false, error };
  }
};

const UserManagement = ({
  users: initialUsers = [
    {
      id: "1",
      name: "John Farmer",
      email: "john@farmmanager.com",
      role: "owner",
      status: "active",
      dateAdded: "2023-01-15",
      permissions: ["all"],
    },
    {
      id: "2",
      name: "Sarah Smith",
      email: "sarah@farmmanager.com",
      role: "worker",
      status: "active",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight",
      dateAdded: "2023-02-20",
      permissions: ["view_fields", "edit_tasks"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@farmmanager.com",
      role: "technician",
      status: "active",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight",
      dateAdded: "2023-03-10",
      permissions: ["view_diagnostics", "edit_equipment"],
    },
    {
      id: "4",
      name: "Emily Brown",
      email: "emily@farmmanager.com",
      role: "worker",
      status: "inactive",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight",
      dateAdded: "2023-04-05",
      permissions: ["view_fields"],
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david@farmmanager.com",
      role: "technician",
      status: "active",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=David&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight",
      dateAdded: "2023-05-12",
      permissions: ["view_diagnostics"],
    },
  ],
  onAddUser = (user) => {
    console.log("User added:", user);
  },
  onEditUser = (id, user) => {
    console.log(`User ${id} updated:`, user);
  },
  onDeleteUser = (id) => {
    console.log(`User ${id} deleted`);
  },
  onUpdateStatus = (id, status) => {
    console.log(`User ${id} status updated to ${status}`);
  },
}: UserManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Initialize form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "worker",
      status: "active",
      permissions: [],
    },
  });

  // Filter users based on search query and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "owners") return matchesSearch && user.role === "owner";
    if (activeTab === "workers") return matchesSearch && user.role === "worker";
    if (activeTab === "technicians")
      return matchesSearch && user.role === "technician";
    if (activeTab === "active")
      return matchesSearch && user.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && user.status === "inactive";

    return matchesSearch;
  });

  // Handle form submission for adding a new user
  const handleAddUser = async (data: UserFormValues) => {
    try {
      console.log("Adding user to Supabase:", data);

      // Add user directly to Supabase
      const result = await addUserToSupabase({
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        permissions: data.permissions || [],
      });

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to add user");
      }

      // Call the onAddUser function with the new user data
      onAddUser(data);

      // Create a new user object with the returned data from Supabase
      const newUser = {
        id: result.data?.id || `user-${users.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        dateAdded: new Date().toISOString().split("T")[0],
        permissions: data.permissions || [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}&gender=male&clothingColor=blue,green,brown&top=hat&clothingGraphic=skull,bear,deer&facialHairColor=black,brown&facialHairType=beardMedium,beardLight`,
      };

      // Add the new user to the local state
      setUsers([...users, newUser]);

      // Close the dialog and reset the form
      setIsAddUserDialogOpen(false);
      form.reset();

      // Show a success message
      alert(`User ${data.name} added successfully!`);

      // Refresh the user list from the database
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert(`Failed to add user: ${error.message}`);
    }
  };

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("date_added", { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to match our User interface
        const formattedUsers = data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          dateAdded: user.date_added
            ? new Date(user.date_added).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          permissions: user.permissions || [],
          avatar: user.avatar,
        }));

        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        fetchUsers,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle form submission for editing a user
  const handleEditUser = async (data: UserFormValues) => {
    if (selectedUser) {
      try {
        // Update user in Supabase
        const { data: updatedUser, error } = await supabase
          .from("users")
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            permissions: data.permissions || [],
          })
          .eq("id", selectedUser.id)
          .select();

        if (error) throw error;

        // Call the onEditUser function
        onEditUser(selectedUser.id, data);

        // Update the user in the local state
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  name: data.name,
                  email: data.email,
                  role: data.role,
                  status: data.status,
                  permissions: data.permissions || [],
                }
              : user,
          ),
        );

        // Close the dialog and reset the selected user
        setIsEditUserDialogOpen(false);
        setSelectedUser(null);

        // Show a success message
        alert(`User ${data.name} updated successfully!`);
      } catch (error) {
        console.error("Error updating user:", error);
        alert(`Failed to update user: ${error.message}`);
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        // Delete user from Supabase
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", selectedUser.id);

        if (error) throw error;

        // Call the onDeleteUser function
        onDeleteUser(selectedUser.id);

        // Remove the user from the local state
        setUsers(users.filter((user) => user.id !== selectedUser.id));

        // Close the dialog and reset the selected user
        setIsDeleteUserDialogOpen(false);
        setSelectedUser(null);

        // Show a success message
        alert(`User ${selectedUser.name} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(`Failed to delete user: ${error.message}`);
      }
    }
  };

  // Open edit user dialog and populate form with user data
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
    });
    setIsEditUserDialogOpen(true);
  };

  // Open delete user dialog
  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-blue-100 text-blue-800";
      case "worker":
        return "bg-green-100 text-green-800";
      case "technician":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  // Get status badge variant and color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle size={12} />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 flex items-center gap-1"
          >
            <XCircle size={12} />
            Inactive
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage users and their permissions</p>
        </div>
        <Dialog
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign permissions.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleAddUser)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="technician">
                              Technician
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddUserDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter size={14} />
                Filter
              </Button>
              <Tabs
                defaultValue="all"
                className="w-full sm:w-auto"
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="owners">Owners</TabsTrigger>
                  <TabsTrigger value="workers">Workers</TabsTrigger>
                  <TabsTrigger value="technicians">Technicians</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAvatarSelectorOpen(true);
                            }}
                          >
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/10">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${getRoleBadgeColor(
                            user.role,
                          )}`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {new Date(user.dateAdded).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditUserDialog(user)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteUserDialog(user)}
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400 mb-2" />
                        <p>No users found</p>
                        <p className="text-sm text-gray-500">
                          {searchQuery
                            ? `No results for "${searchQuery}"`
                            : "Try adding a new user"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <UserCog size={16} className="mr-2" />
              Permissions
            </Button>
            <Button variant="outline" size="sm">
              <Shield size={16} className="mr-2" />
              Roles
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleEditUser)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="technician">
                              Technician
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditUserDialogOpen(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Avatar>
                  {selectedUser.avatar ? (
                    <AvatarImage
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10">
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <AlertCircle size={16} className="text-destructive" />
                <p className="text-sm text-destructive">
                  This will permanently delete the user and revoke all access.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteUserDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Selector Dialog */}
      {selectedUser && (
        <AvatarSelector
          currentAvatar={selectedUser.avatar}
          onAvatarChange={async (newAvatar) => {
            try {
              // Update avatar in Supabase
              const { error } = await supabase
                .from("users")
                .update({ avatar: newAvatar })
                .eq("id", selectedUser.id);

              if (error) throw error;

              // Update the user in the local state
              setUsers(
                users.map((user) =>
                  user.id === selectedUser.id
                    ? { ...user, avatar: newAvatar }
                    : user,
                ),
              );

              // Show success message
              alert(`Avatar updated successfully!`);
            } catch (error) {
              console.error("Error updating avatar:", error);
              alert(`Failed to update avatar: ${error.message}`);
            }
          }}
          open={isAvatarSelectorOpen}
          onOpenChange={setIsAvatarSelectorOpen}
        />
      )}
    </div>
  );
};

export default UserManagement;
