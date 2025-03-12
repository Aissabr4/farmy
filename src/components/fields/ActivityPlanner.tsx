import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
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
  CalendarIcon,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Tractor,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";

interface ActivityPlannerProps {
  fieldId?: string;
  fieldName?: string;
  onTaskCreated?: (task: any) => void;
}

const ActivityPlanner = ({
  fieldId = "field-1",
  fieldName = "North Field",
  onTaskCreated = (task) => {
    console.log("Task created:", task);
  },
}: ActivityPlannerProps) => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Mock data for upcoming and past activities
  const upcomingActivities = [
    {
      id: "task-1",
      title: "Irrigation",
      description: "Schedule irrigation for corn section",
      date: new Date(Date.now() + 86400000), // tomorrow
      assignedTo: "John Doe",
      priority: "high",
    },
    {
      id: "task-2",
      title: "Fertilization",
      description: "Apply nitrogen fertilizer",
      date: new Date(Date.now() + 172800000), // day after tomorrow
      assignedTo: "Sarah Smith",
      priority: "medium",
    },
  ];

  const pastActivities = [
    {
      id: "task-3",
      title: "Planting",
      description: "Corn seeds planted",
      date: new Date(Date.now() - 1296000000), // 15 days ago
      assignedTo: "Mike Johnson",
      priority: "high",
      completed: true,
    },
    {
      id: "task-4",
      title: "Pest Control",
      description: "Applied organic pesticides",
      date: new Date(Date.now() - 604800000), // 7 days ago
      assignedTo: "Emily Brown",
      priority: "medium",
      completed: true,
    },
  ];

  // Priority badge color mapping
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a task and send it to the backend
    setIsDialogOpen(false);
    onTaskCreated({
      title: "New Task",
      description: "Task description",
      date: selectedDate,
      assignedTo: "Worker Name",
      priority: "medium",
    });
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <Card className="w-full h-full bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Activity Planner</CardTitle>
              <CardDescription>
                Plan and schedule activities for {fieldName}
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Schedule a new task for {fieldName}. Fill in the details
                    below.
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
                        defaultValue="Irrigation"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="task-description"
                        className="text-right text-sm font-medium"
                      >
                        Description
                      </label>
                      <Textarea
                        id="task-description"
                        placeholder="Task description"
                        className="col-span-3"
                        defaultValue="Schedule irrigation for corn section"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium">
                        Date
                      </label>
                      <div className="col-span-3">
                        <Input
                          type="date"
                          className="w-full"
                          value={
                            selectedDate
                              ? format(selectedDate, "yyyy-MM-dd")
                              : ""
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
                          <SelectItem value="sarah-smith">
                            Sarah Smith
                          </SelectItem>
                          <SelectItem value="mike-johnson">
                            Mike Johnson
                          </SelectItem>
                          <SelectItem value="emily-brown">
                            Emily Brown
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Button type="submit">Create Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="upcoming"
            className="w-full"
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Upcoming Activities</TabsTrigger>
              <TabsTrigger value="past">Past Activities</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingActivities.length > 0 ? (
                upcomingActivities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <div className="flex border-l-4 border-blue-500">
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${priorityColors[activity.priority as keyof typeof priorityColors]}`}
                          >
                            {activity.priority.charAt(0).toUpperCase() +
                              activity.priority.slice(1)}{" "}
                            Priority
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays size={16} />
                            {format(activity.date, "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={16} />
                            {format(activity.date, "h:mm a")}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users size={16} />
                            {activity.assignedTo}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50">
                        <Button variant="outline" size="sm" className="mr-2">
                          Reschedule
                        </Button>
                        <Button size="sm">Start Task</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Tractor className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No upcoming activities
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new task.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {pastActivities.length > 0 ? (
                pastActivities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <div className="flex border-l-4 border-gray-300">
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">
                                {activity.title}
                              </h3>
                              {activity.completed ? (
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                              ) : (
                                <AlertTriangle
                                  size={16}
                                  className="text-yellow-500"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${priorityColors[activity.priority as keyof typeof priorityColors]}`}
                          >
                            {activity.priority.charAt(0).toUpperCase() +
                              activity.priority.slice(1)}{" "}
                            Priority
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays size={16} />
                            {format(activity.date, "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={16} />
                            {format(activity.date, "h:mm a")}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users size={16} />
                            {activity.assignedTo}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Tractor className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No past activities
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Completed activities will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {selectedTab === "upcoming"
              ? upcomingActivities.length
              : pastActivities.length}{" "}
            activities
          </div>
          {selectedTab === "upcoming" && (
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ActivityPlanner;
