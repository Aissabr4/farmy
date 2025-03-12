import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Calendar,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Tractor,
  User,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string;
  field: string;
  assignedTo: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

interface TaskManagementProps {
  userRole?: "owner" | "worker" | "technician";
  tasks?: Task[];
  onTaskCreate?: (task: Partial<Task>) => void;
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
  onTaskDelete?: (id: string) => void;
}

const TaskManagement = ({
  userRole = "owner",
  tasks = [
    {
      id: "task-1",
      title: "Irrigation Check",
      description: "Check irrigation system in North Field",
      field: "North Field",
      assignedTo: "John Doe",
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      priority: "high",
      status: "pending",
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "task-2",
      title: "Fertilizer Application",
      description: "Apply nitrogen fertilizer to East Field",
      field: "East Field",
      assignedTo: "Sarah Smith",
      dueDate: new Date(Date.now() + 172800000), // 2 days from now
      priority: "medium",
      status: "in-progress",
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
    },
    {
      id: "task-3",
      title: "Harvest Preparation",
      description: "Prepare equipment for upcoming harvest",
      field: "South Field",
      assignedTo: "Mike Johnson",
      dueDate: new Date(Date.now() + 432000000), // 5 days from now
      priority: "low",
      status: "pending",
      createdAt: new Date(Date.now() - 345600000), // 4 days ago
      updatedAt: new Date(Date.now() - 345600000), // 4 days ago
    },
    {
      id: "task-4",
      title: "Equipment Maintenance",
      description: "Perform routine maintenance on tractor",
      field: "Workshop",
      assignedTo: "John Doe",
      dueDate: new Date(Date.now() + 259200000), // 3 days from now
      priority: "medium",
      status: "pending",
      createdAt: new Date(Date.now() - 432000000), // 5 days ago
      updatedAt: new Date(Date.now() - 432000000), // 5 days ago
    },
    {
      id: "task-5",
      title: "Soil Sampling",
      description: "Collect soil samples from West Field",
      field: "West Field",
      assignedTo: "Emily Brown",
      dueDate: new Date(Date.now() - 86400000), // yesterday
      priority: "high",
      status: "completed",
      createdAt: new Date(Date.now() - 518400000), // 6 days ago
      updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
    },
    {
      id: "task-6",
      title: "Fence Repair",
      description: "Fix damaged fence in North Field",
      field: "North Field",
      assignedTo: "Mike Johnson",
      dueDate: new Date(Date.now() - 172800000), // 2 days ago
      priority: "medium",
      status: "cancelled",
      createdAt: new Date(Date.now() - 604800000), // 7 days ago
      updatedAt: new Date(Date.now() - 259200000), // 3 days ago
    },
  ],
  onTaskCreate = (task) => {
    console.log("Task created:", task);
  },
  onTaskUpdate = (id, updates) => {
    console.log(`Task ${id} updated:`, updates);
  },
  onTaskDelete = (id) => {
    console.log(`Task ${id} deleted`);
  },
}: TaskManagementProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter tasks based on active tab, search query, and selected date
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab (status)
    if (activeTab !== "all" && task.status !== activeTab) return false;

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.field.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by selected date
    if (selectedDate) {
      const taskDate = new Date(task.dueDate);
      if (
        taskDate.getDate() !== selectedDate.getDate() ||
        taskDate.getMonth() !== selectedDate.getMonth() ||
        taskDate.getFullYear() !== selectedDate.getFullYear()
      )
        return false;
    }

    return true;
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "dueDate":
        comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        comparison =
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "field":
        comparison = a.field.localeCompare(b.field);
        break;
      case "assignedTo":
        comparison = a.assignedTo.localeCompare(b.assignedTo);
        break;
      default:
        comparison = a.dueDate.getTime() - b.dueDate.getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Priority badge color mapping
  const priorityColors = {
    high: "bg-red-100 text-red-800 hover:bg-red-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    low: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  // Status badge color mapping
  const statusColors = {
    pending: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };

  // Status icon mapping
  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    "in-progress": <Tractor className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a task with form data
    const newTask = {
      title: "New Task",
      description: "Task description",
      field: "North Field",
      assignedTo: "John Doe",
      dueDate: new Date(Date.now() + 86400000),
      priority: "medium" as const,
      status: "pending" as const,
    };
    onTaskCreate(newTask);
    setIsCreateDialogOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    onTaskUpdate(taskId, { status: newStatus as any });
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <Card className="w-full h-full bg-white">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Task Management</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track all farm tasks and activities
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Create Task
            </Button>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <SlidersHorizontal size={14} />
                    Sort: {sortBy}
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                    Due Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("priority")}>
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")}>
                    Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("field")}>
                    Field
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("assignedTo")}>
                    Assigned To
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setSelectedDate(undefined)}
              >
                <Filter size={14} />
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "Filter Date"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Select Date</DialogTitle>
                    <DialogDescription>
                      Filter tasks by due date
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            className="w-full mt-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          {sortedTasks.length > 0 ? (
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)]">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-start gap-3">
                          {userRole === "worker" && (
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={task.status === "completed"}
                              onCheckedChange={(checked) =>
                                handleStatusChange(
                                  task.id,
                                  checked ? "completed" : "pending",
                                )
                              }
                              disabled={
                                task.status === "cancelled" ||
                                (userRole === "worker" &&
                                  task.assignedTo !== "John Doe")
                              }
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-lg">
                              {task.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          <Badge
                            variant="outline"
                            className={priorityColors[task.priority]}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={statusColors[task.status]}
                          >
                            <span className="flex items-center gap-1">
                              {statusIcons[task.status]}
                              {task.status
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(" ")}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Tractor className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Field:</span>
                          <span className="font-medium">{task.field}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Assigned to:</span>
                          <span className="font-medium">{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Due:</span>
                          <span
                            className={`font-medium ${task.dueDate < new Date() && task.status === "pending" ? "text-red-600" : ""}`}
                          >
                            {format(task.dueDate, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-between items-center p-4 bg-gray-50 border-t md:border-t-0 md:border-l">
                      {userRole === "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task.id, "pending")
                              }
                              disabled={task.status === "pending"}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task.id, "in-progress")
                              }
                              disabled={task.status === "in-progress"}
                            >
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task.id, "completed")
                              }
                              disabled={task.status === "completed"}
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(task.id, "cancelled")
                              }
                              disabled={task.status === "cancelled"}
                            >
                              Cancel Task
                            </DropdownMenuItem>
                            <Separator className="my-2" />
                            <DropdownMenuItem
                              onClick={() => onTaskDelete(task.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {userRole === "worker" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            task.status === "cancelled" ||
                            task.status === "completed" ||
                            task.assignedTo !== "John Doe"
                          }
                          onClick={() =>
                            handleStatusChange(
                              task.id,
                              task.status === "pending"
                                ? "in-progress"
                                : "completed",
                            )
                          }
                        >
                          {task.status === "pending"
                            ? "Start Task"
                            : task.status === "in-progress"
                              ? "Complete Task"
                              : "Completed"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tractor className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No tasks found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery || selectedDate
                  ? "Try adjusting your filters to see more results."
                  : "Get started by creating a new task."}
              </p>
              {!searchQuery && !selectedDate && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to assign to farm workers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="task-title"
                  className="text-right text-sm font-medium"
                >
                  Title
                </label>
                <Input
                  id="task-title"
                  placeholder="Task title"
                  className="col-span-3"
                  defaultValue="Irrigation Check"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="task-description"
                  className="text-right text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  placeholder="Task description"
                  className="col-span-3 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                  defaultValue="Check irrigation system in North Field"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="task-field"
                  className="text-right text-sm font-medium"
                >
                  Field
                </label>
                <Select defaultValue="north-field">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north-field">North Field</SelectItem>
                    <SelectItem value="east-field">East Field</SelectItem>
                    <SelectItem value="south-field">South Field</SelectItem>
                    <SelectItem value="west-field">West Field</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="assigned-to"
                  className="text-right text-sm font-medium"
                >
                  Assign To
                </label>
                <Select defaultValue="john-doe">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select worker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="sarah-smith">Sarah Smith</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                    <SelectItem value="emily-brown">Emily Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="due-date"
                  className="text-right text-sm font-medium"
                >
                  Due Date
                </label>
                <div className="col-span-3">
                  <Input
                    type="date"
                    id="due-date"
                    className="w-full"
                    value={
                      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      setSelectedDate(date);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="priority"
                  className="text-right text-sm font-medium"
                >
                  Priority
                </label>
                <Select defaultValue="medium">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
