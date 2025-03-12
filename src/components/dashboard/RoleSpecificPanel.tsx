import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  Calendar,
  ClipboardList,
  Cog,
  Crop,
  LayoutDashboard,
  Plus,
  Settings,
  Tractor,
  Users,
  Wrench,
} from "lucide-react";

interface RoleSpecificPanelProps {
  userRole?: "owner" | "worker" | "technician";
  onNavigate?: (destination: string) => void;
}

const RoleSpecificPanel = ({
  userRole = "owner",
  onNavigate = (destination) => console.log(`Navigating to ${destination}`),
}: RoleSpecificPanelProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Render different content based on user role
  const renderRoleContent = () => {
    switch (userRole) {
      case "owner":
        return <OwnerPanel onNavigate={onNavigate} activeTab={activeTab} />;
      case "worker":
        return <WorkerPanel onNavigate={onNavigate} activeTab={activeTab} />;
      case "technician":
        return (
          <TechnicianPanel onNavigate={onNavigate} activeTab={activeTab} />
        );
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            {userRole === "owner"
              ? "Farm Management"
              : userRole === "worker"
                ? "Task Management"
                : "Technical Diagnostics"}
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {userRole} View
          </Badge>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="overview" className="mt-0">
            {renderRoleContent()}
          </TabsContent>
          <TabsContent value="details" className="mt-0">
            {renderRoleContent()}
          </TabsContent>
          <TabsContent value="actions" className="mt-0">
            {renderRoleContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RolePanelProps {
  onNavigate: (destination: string) => void;
  activeTab: string;
}

const OwnerPanel = ({ onNavigate, activeTab }: RolePanelProps) => {
  // Mock data
  const fieldStats = {
    total: 12,
    healthy: 8,
    warning: 3,
    critical: 1,
  };

  const recentActivities = [
    { id: 1, name: "Irrigation", field: "North Field", date: "Today" },
    { id: 2, name: "Fertilization", field: "East Field", date: "Yesterday" },
    { id: 3, name: "Pest Control", field: "West Field", date: "2 days ago" },
  ];

  if (activeTab === "overview") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Fields</p>
                  <h3 className="text-2xl font-bold">{fieldStats.total}</h3>
                </div>
                <Crop className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Active Workers</p>
                  <h3 className="text-2xl font-bold">7</h3>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Pending Tasks</p>
                  <h3 className="text-2xl font-bold">5</h3>
                </div>
                <ClipboardList className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Field Status</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("fields")}
            >
              View All
            </Button>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="bg-green-500">
              Healthy: {fieldStats.healthy}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              Warning: {fieldStats.warning}
            </Badge>
            <Badge variant="destructive">Critical: {fieldStats.critical}</Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Recent Activities</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("activities")}
            >
              See All
            </Button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.field}</p>
                </div>
                <Badge variant="outline">{activity.date}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => onNavigate("add-field")}
            className="gap-1"
            size="sm"
          >
            <Plus size={16} /> Add Field
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("settings")}
            className="gap-1"
            size="sm"
          >
            <Settings size={16} /> Settings
          </Button>
        </div>
      </div>
    );
  }

  if (activeTab === "details") {
    return (
      <div className="space-y-4">
        <Alert>
          <LayoutDashboard className="h-4 w-4" />
          <AlertTitle>Farm Management Details</AlertTitle>
          <AlertDescription>
            Access detailed information about your farm operations, fields, and
            personnel.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onNavigate("field-management")}
          >
            <Crop className="h-6 w-6" />
            <span>Field Management</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onNavigate("user-management")}
          >
            <Users className="h-6 w-6" />
            <span>User Management</span>
          </Button>
        </div>
      </div>
    );
  }

  if (activeTab === "actions") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("add-field")}
          >
            <Plus size={18} />
            <span>Add New Field</span>
          </Button>
          <Button
            variant="secondary"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("schedule")}
          >
            <Calendar size={18} />
            <span>Schedule Activity</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("reports")}
          >
            <ClipboardList size={18} />
            <span>Generate Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("settings")}
          >
            <Settings size={18} />
            <span>Farm Settings</span>
          </Button>
        </div>
      </div>
    );
  }

  return <div>Select a tab to view content</div>;
};

const WorkerPanel = ({ onNavigate, activeTab }: RolePanelProps) => {
  // Mock data
  const assignedTasks = [
    {
      id: 1,
      name: "Irrigation Check",
      field: "North Field",
      priority: "high",
      due: "Today",
    },
    {
      id: 2,
      name: "Harvest Preparation",
      field: "East Field",
      priority: "medium",
      due: "Tomorrow",
    },
    {
      id: 3,
      name: "Equipment Maintenance",
      field: "Workshop",
      priority: "low",
      due: "Next Week",
    },
  ];

  if (activeTab === "overview") {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle>Welcome, Worker</AlertTitle>
          <AlertDescription>
            You have {assignedTasks.length} tasks assigned to you. 1 task is due
            today.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Assigned Tasks</h3>
          <div className="space-y-2">
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-gray-500">{task.field}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline">Due: {task.due}</Badge>
                  <Button
                    size="sm"
                    onClick={() => onNavigate(`task/${task.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => onNavigate("tasks")}
            className="gap-1"
            size="sm"
          >
            <ClipboardList size={16} /> All Tasks
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("report-issue")}
            className="gap-1"
            size="sm"
          >
            <Wrench size={16} /> Report Issue
          </Button>
        </div>
      </div>
    );
  }

  if (activeTab === "details") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Completed Tasks</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
                <ClipboardList className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Hours Logged</p>
                  <h3 className="text-2xl font-bold">37.5</h3>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate("worker-schedule")}
        >
          View Full Schedule
        </Button>
      </div>
    );
  }

  if (activeTab === "actions") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("mark-complete")}
          >
            <ClipboardList size={18} />
            <span>Mark Task Complete</span>
          </Button>
          <Button
            variant="secondary"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("log-hours")}
          >
            <Calendar size={18} />
            <span>Log Work Hours</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("report-issue")}
          >
            <Wrench size={18} />
            <span>Report Issue</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("request-supplies")}
          >
            <Tractor size={18} />
            <span>Request Supplies</span>
          </Button>
        </div>
      </div>
    );
  }

  return <div>Select a tab to view content</div>;
};

const TechnicianPanel = ({ onNavigate, activeTab }: RolePanelProps) => {
  // Mock data
  const systemAlerts = [
    {
      id: 1,
      name: "Irrigation System Pressure Low",
      location: "North Field",
      severity: "high",
    },
    {
      id: 2,
      name: "Weather Station Offline",
      location: "Main Building",
      severity: "medium",
    },
    {
      id: 3,
      name: "Soil Sensor Battery Low",
      location: "East Field",
      severity: "low",
    },
  ];

  if (activeTab === "overview") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-red-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Critical Alerts</p>
                  <h3 className="text-2xl font-bold">1</h3>
                </div>
                <Cog className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Warnings</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
                <Wrench className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Systems Online</p>
                  <h3 className="text-2xl font-bold">12/15</h3>
                </div>
                <Settings className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">System Alerts</h3>
          <div className="space-y-2">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{alert.name}</p>
                    <p className="text-sm text-gray-500">{alert.location}</p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "high"
                        ? "destructive"
                        : alert.severity === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={() => onNavigate(`alert/${alert.id}`)}
                  >
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => onNavigate("diagnostics")}
            className="gap-1"
            size="sm"
          >
            <Cog size={16} /> Run Diagnostics
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("maintenance")}
            className="gap-1"
            size="sm"
          >
            <Wrench size={16} /> Schedule Maintenance
          </Button>
        </div>
      </div>
    );
  }

  if (activeTab === "details") {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle>System Status</AlertTitle>
          <AlertDescription>
            12 out of 15 systems are currently online and functioning normally.
            3 systems require attention.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Maintenance Tasks</p>
                  <h3 className="text-2xl font-bold">7</h3>
                </div>
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Equipment Status</p>
                  <h3 className="text-2xl font-bold">85%</h3>
                  <p className="text-xs text-gray-500">Operational</p>
                </div>
                <Tractor className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate("system-overview")}
        >
          View Full System Overview
        </Button>
      </div>
    );
  }

  if (activeTab === "actions") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("run-diagnostics")}
          >
            <Cog size={18} />
            <span>Run System Diagnostics</span>
          </Button>
          <Button
            variant="secondary"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("schedule-maintenance")}
          >
            <Calendar size={18} />
            <span>Schedule Maintenance</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("calibrate-sensors")}
          >
            <Settings size={18} />
            <span>Calibrate Sensors</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex items-center justify-center gap-2"
            onClick={() => onNavigate("order-parts")}
          >
            <Wrench size={18} />
            <span>Order Replacement Parts</span>
          </Button>
        </div>
      </div>
    );
  }

  return <div>Select a tab to view content</div>;
};

export default RoleSpecificPanel;
