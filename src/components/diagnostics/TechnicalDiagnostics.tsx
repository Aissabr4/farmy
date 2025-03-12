import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  AlertTriangle,
  BarChart3,
  Battery,
  BellRing,
  Cable,
  CheckCircle,
  Cog,
  Download,
  FileWarning,
  HardDrive,
  History,
  Info,
  LayoutDashboard,
  Loader,
  RefreshCw,
  Server,
  Settings,
  Thermometer,
  Wifi,
  WifiOff,
  Wrench,
} from "lucide-react";

interface SystemStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "warning" | "maintenance";
  lastChecked: string;
  uptime?: string;
  details?: string;
}

interface DiagnosticResult {
  id: string;
  component: string;
  status: "passed" | "failed" | "warning";
  message: string;
  timestamp: string;
}

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignedTo?: string;
  status: "pending" | "in-progress" | "completed";
}

interface TechnicalDiagnosticsProps {
  systems?: SystemStatus[];
  diagnosticResults?: DiagnosticResult[];
  maintenanceTasks?: MaintenanceTask[];
  onRunDiagnostics?: () => void;
  onScheduleMaintenance?: (systemId: string) => void;
  onViewSystemDetails?: (systemId: string) => void;
}

const TechnicalDiagnostics = ({
  systems = [
    {
      id: "sys-001",
      name: "Irrigation System",
      status: "warning",
      lastChecked: "2 hours ago",
      uptime: "98.5%",
      details: "Pressure fluctuations detected",
    },
    {
      id: "sys-002",
      name: "Weather Station",
      status: "online",
      lastChecked: "30 minutes ago",
      uptime: "99.9%",
      details: "All sensors functioning normally",
    },
    {
      id: "sys-003",
      name: "Soil Sensors Network",
      status: "warning",
      lastChecked: "1 hour ago",
      uptime: "95.2%",
      details: "3 sensors reporting low battery",
    },
    {
      id: "sys-004",
      name: "Security Cameras",
      status: "online",
      lastChecked: "15 minutes ago",
      uptime: "99.7%",
      details: "All cameras operational",
    },
    {
      id: "sys-005",
      name: "Automated Feeders",
      status: "offline",
      lastChecked: "3 hours ago",
      details: "Connection lost to control unit",
    },
    {
      id: "sys-006",
      name: "Water Quality Monitors",
      status: "maintenance",
      lastChecked: "1 day ago",
      details: "Scheduled calibration in progress",
    },
  ],
  diagnosticResults = [
    {
      id: "diag-001",
      component: "Irrigation Pump #2",
      status: "warning",
      message: "Pressure below optimal range",
      timestamp: "Today, 10:23 AM",
    },
    {
      id: "diag-002",
      component: "Network Gateway",
      status: "passed",
      message: "All systems connected",
      timestamp: "Today, 10:22 AM",
    },
    {
      id: "diag-003",
      component: "Soil Sensor Array",
      status: "warning",
      message: "3 sensors need battery replacement",
      timestamp: "Today, 10:22 AM",
    },
    {
      id: "diag-004",
      component: "Automated Feeder",
      status: "failed",
      message: "Communication failure",
      timestamp: "Today, 10:21 AM",
    },
    {
      id: "diag-005",
      component: "Weather Station",
      status: "passed",
      message: "All sensors calibrated and functional",
      timestamp: "Today, 10:21 AM",
    },
  ],
  maintenanceTasks = [
    {
      id: "task-001",
      title: "Replace Soil Sensor Batteries",
      description: "Replace batteries in sensors #5, #8, and #12 in East Field",
      priority: "medium",
      dueDate: "Tomorrow",
      assignedTo: "Mike Johnson",
      status: "pending",
    },
    {
      id: "task-002",
      title: "Irrigation System Maintenance",
      description: "Check pressure regulators and clean filters",
      priority: "high",
      dueDate: "Today",
      assignedTo: "Sarah Smith",
      status: "in-progress",
    },
    {
      id: "task-003",
      title: "Recalibrate Weather Station",
      description: "Quarterly calibration of all weather sensors",
      priority: "low",
      dueDate: "Next Week",
      assignedTo: "Mike Johnson",
      status: "pending",
    },
    {
      id: "task-004",
      title: "Fix Automated Feeder Connection",
      description:
        "Troubleshoot network connection to automated feeder control unit",
      priority: "high",
      dueDate: "Today",
      assignedTo: "Emily Brown",
      status: "pending",
    },
    {
      id: "task-005",
      title: "Update System Firmware",
      description: "Apply latest firmware updates to all system controllers",
      priority: "medium",
      dueDate: "This Week",
      assignedTo: "Sarah Smith",
      status: "completed",
    },
  ],
  onRunDiagnostics = () => {
    console.log("Running diagnostics");
  },
  onScheduleMaintenance = (systemId) => {
    console.log(`Scheduling maintenance for ${systemId}`);
  },
  onViewSystemDetails = (systemId) => {
    console.log(`Viewing details for ${systemId}`);
  },
}: TechnicalDiagnosticsProps) => {
  const [activeTab, setActiveTab] = useState("systems");
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Count systems by status
  const systemCounts = {
    total: systems.length,
    online: systems.filter((s) => s.status === "online").length,
    warning: systems.filter((s) => s.status === "warning").length,
    offline: systems.filter((s) => s.status === "offline").length,
    maintenance: systems.filter((s) => s.status === "maintenance").length,
  };

  // Status icon mapping
  const getStatusIcon = (status: string, size = 16) => {
    switch (status) {
      case "online":
        return <CheckCircle size={size} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={size} className="text-yellow-500" />;
      case "offline":
        return <WifiOff size={size} className="text-red-500" />;
      case "maintenance":
        return <Wrench size={size} className="text-blue-500" />;
      case "passed":
        return <CheckCircle size={size} className="text-green-500" />;
      case "failed":
        return <FileWarning size={size} className="text-red-500" />;
      default:
        return <Info size={size} className="text-gray-500" />;
    }
  };

  // Priority badge color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "passed":
      case "completed":
        return "bg-green-100 text-green-800";
      case "warning":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
      case "failed":
        return "bg-red-100 text-red-800";
      case "maintenance":
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle running diagnostics
  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      onRunDiagnostics();
    }, 2000);
  };

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      <div className="flex flex-col space-y-6">
        {/* Header with summary stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Technical Diagnostics</h1>
            <p className="text-gray-500">
              Monitor and maintain farm systems and equipment
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRunDiagnostics}
              disabled={isRunningDiagnostics}
            >
              {isRunningDiagnostics ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Run Diagnostics
                </>
              )}
            </Button>
            <Button className="flex items-center gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </div>

        {/* System status summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Systems</p>
                  <p className="text-2xl font-bold">{systemCounts.total}</p>
                </div>
                <Server className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Online</p>
                  <p className="text-2xl font-bold">{systemCounts.online}</p>
                </div>
                <Wifi className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Warnings</p>
                  <p className="text-2xl font-bold">{systemCounts.warning}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Offline</p>
                  <p className="text-2xl font-bold">
                    {systemCounts.offline + systemCounts.maintenance}
                  </p>
                </div>
                <WifiOff className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content tabs */}
        <Card className="bg-white">
          <CardHeader className="pb-0">
            <Tabs
              defaultValue="systems"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="systems">Systems</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="systems" className="w-full">
              <TabsContent value="systems" className="mt-0 space-y-4">
                {/* Systems overview */}
                {systems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systems.map((system) => (
                      <Card key={system.id} className="overflow-hidden">
                        <div className="flex border-l-4 border-l-blue-500">
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{system.name}</h3>
                                  {getStatusIcon(system.status)}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  Last checked: {system.lastChecked}
                                </p>
                              </div>
                              <Badge className={getStatusColor(system.status)}>
                                {system.status.charAt(0).toUpperCase() +
                                  system.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">{system.details}</p>
                              {system.uptime && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <span>Uptime</span>
                                    <span>{system.uptime}</span>
                                  </div>
                                  <Progress
                                    value={parseFloat(
                                      system.uptime.replace("%", ""),
                                    )}
                                    className="h-1"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center p-4 bg-gray-50">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mb-2"
                              onClick={() => onViewSystemDetails(system.id)}
                            >
                              Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onScheduleMaintenance(system.id)}
                            >
                              Maintain
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Server className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No systems found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add systems to monitor their status.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="diagnostics" className="mt-0 space-y-4">
                {/* Diagnostic results */}
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Diagnostic Information</AlertTitle>
                  <AlertDescription>
                    Last diagnostic scan ran{" "}
                    {diagnosticResults.length > 0
                      ? diagnosticResults[0].timestamp
                      : "never"}
                    . Run diagnostics regularly to ensure optimal system
                    performance.
                  </AlertDescription>
                </Alert>

                {diagnosticResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Latest Diagnostic Results</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleRunDiagnostics}
                        disabled={isRunningDiagnostics}
                      >
                        {isRunningDiagnostics ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={14} />
                            Run Again
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="py-3 px-4 font-medium">Component</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Message</th>
                            <th className="py-3 px-4 font-medium">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diagnosticResults.map((result) => (
                            <tr
                              key={result.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">{result.component}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(result.status)}
                                  <span
                                    className={`text-sm ${result.status === "passed" ? "text-green-600" : result.status === "warning" ? "text-yellow-600" : "text-red-600"}`}
                                  >
                                    {result.status.charAt(0).toUpperCase() +
                                      result.status.slice(1)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">{result.message}</td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {result.timestamp}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-gray-500">
                        Showing {diagnosticResults.length} results
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View History
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <LayoutDashboard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No diagnostic results
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Run a diagnostic scan to see results.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={handleRunDiagnostics}
                        disabled={isRunningDiagnostics}
                      >
                        {isRunningDiagnostics ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Running Diagnostics...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Run Diagnostics
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0 space-y-4">
                {/* Maintenance tasks */}
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Maintenance Tasks</h3>
                  <Button size="sm" className="flex items-center gap-2">
                    <Wrench size={14} />
                    Schedule Maintenance
                  </Button>
                </div>

                {maintenanceTasks.length > 0 ? (
                  <div className="space-y-4">
                    {maintenanceTasks.map((task) => (
                      <Card key={task.id} className="overflow-hidden">
                        <div
                          className={`flex border-l-4 ${task.priority === "high" ? "border-red-500" : task.priority === "medium" ? "border-yellow-500" : "border-green-500"}`}
                        >
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {task.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status === "in-progress"
                                    ? "In Progress"
                                    : task.status.charAt(0).toUpperCase() +
                                      task.status.slice(1)}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={getPriorityColor(task.priority)}
                                >
                                  {task.priority.charAt(0).toUpperCase() +
                                    task.priority.slice(1)}{" "}
                                  Priority
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <BellRing size={14} />
                                Due: {task.dueDate}
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Info size={14} />
                                  Assigned to: {task.assignedTo}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center p-4 bg-gray-50">
                            <Button
                              variant={
                                task.status === "completed"
                                  ? "outline"
                                  : "default"
                              }
                              size="sm"
                            >
                              {task.status === "completed"
                                ? "View Details"
                                : task.status === "in-progress"
                                  ? "Mark Complete"
                                  : "Start Task"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No maintenance tasks
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Schedule maintenance tasks to keep your systems running
                      optimally.
                    </p>
                    <div className="mt-6">
                      <Button>
                        <Wrench className="mr-2 h-4 w-4" />
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* System health indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Connected</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Stable</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Signal Strength</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Last outage: 7 days ago (2 minutes)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                System Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">38°C</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Temperature</span>
                  <span>38°C / 100°F</span>
                </div>
                <Progress value={76} className="h-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Optimal range: 10-35°C
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">
                Battery Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="h-5 w-5 text-green-500" />
                  <span className="font-medium">85%</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Backup Power</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Estimated runtime: 72 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => alert("Viewing system history")}
          >
            <History className="h-6 w-6" />
            <span>View History</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => alert("System backup initiated")}
          >
            <HardDrive className="h-6 w-6" />
            <span>System Backup</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => alert("Connection test started")}
          >
            <Cable className="h-6 w-6" />
            <span>Connection Test</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-2"
            onClick={() => alert("Advanced settings opened")}
          >
            <Settings className="h-6 w-6" />
            <span>Advanced Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDiagnostics;
