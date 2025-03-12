import React, { useState } from "react";
import WeatherWidget from "./WeatherWidget";
import FieldOverview from "./FieldOverview";
import NotificationPanel from "./NotificationPanel";
import RoleSpecificPanel from "./RoleSpecificPanel";

interface DashboardContentProps {
  userRole?: "owner" | "worker" | "technician";
  userName?: string;
  weatherData?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    condition?: "sunny" | "cloudy" | "rainy" | "foggy" | "snowy";
    forecast?: {
      day: string;
      temperature: number;
      condition: "sunny" | "cloudy" | "rainy" | "foggy" | "snowy";
    }[];
    location?: string;
  };
  fields?: Array<{
    id: string;
    name: string;
    status: "healthy" | "warning" | "critical";
    cropType: string;
    soilMoisture: number;
    sunlight: number;
    growthStage: string;
  }>;
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    type: "alert" | "task" | "info";
    status?: "pending" | "completed";
    priority?: "low" | "medium" | "high";
    read: boolean;
  }>;
  onNavigate?: (destination: string) => void;
  onAddField?: () => void;
  onFieldClick?: (fieldId: string) => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

const DashboardContent = ({
  userRole = "owner",
  userName = "John Farmer",
  weatherData = {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "sunny",
    location: "Farm Location",
    forecast: [
      { day: "Mon", temperature: 25, condition: "sunny" },
      { day: "Tue", temperature: 23, condition: "cloudy" },
      { day: "Wed", temperature: 22, condition: "rainy" },
      { day: "Thu", temperature: 24, condition: "sunny" },
      { day: "Fri", temperature: 26, condition: "sunny" },
    ],
  },
  fields = [
    {
      id: "field-1",
      name: "North Field",
      status: "healthy",
      cropType: "Corn",
      soilMoisture: 75,
      sunlight: 85,
      growthStage: "Mature",
    },
    {
      id: "field-2",
      name: "South Field",
      status: "warning",
      cropType: "Wheat",
      soilMoisture: 45,
      sunlight: 90,
      growthStage: "Growing",
    },
    {
      id: "field-3",
      name: "East Field",
      status: "critical",
      cropType: "Soybeans",
      soilMoisture: 30,
      sunlight: 65,
      growthStage: "Early",
    },
    {
      id: "field-4",
      name: "West Field",
      status: "healthy",
      cropType: "Barley",
      soilMoisture: 80,
      sunlight: 75,
      growthStage: "Mature",
    },
  ],
  notifications = [
    {
      id: "1",
      title: "Weather Alert",
      message: "Heavy rain expected in the next 24 hours",
      time: "10 min ago",
      type: "alert",
      priority: "high",
      read: false,
    },
    {
      id: "2",
      title: "Task Completed",
      message: "Field irrigation completed successfully",
      time: "1 hour ago",
      type: "task",
      status: "completed",
      read: true,
    },
    {
      id: "3",
      title: "New Task Assigned",
      message: "Check soil moisture in North Field",
      time: "3 hours ago",
      type: "task",
      status: "pending",
      priority: "medium",
      read: false,
    },
  ],
  onNavigate = (destination) => console.log(`Navigating to ${destination}`),
  onAddField = () => console.log("Add field clicked"),
  onFieldClick = (fieldId) => console.log(`Field ${fieldId} clicked`),
  onMarkNotificationAsRead = (id) => {
    console.log(`Marked notification ${id} as read`);
  },
  onClearAllNotifications = () => {
    console.log("Cleared all notifications");
  },
}: DashboardContentProps) => {
  // Responsive layout state
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on component mount and window resize
  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  return (
    <div className="w-full h-full p-4 md:p-6 bg-gray-50 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top row - Weather and Notifications */}
        <div className="lg:col-span-2">
          <WeatherWidget data={weatherData} className="mb-6" />
        </div>
        <div>
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onClearAll={onClearAllNotifications}
            onFilterChange={(filter) =>
              console.log(`Filter changed to ${filter}`)
            }
          />
        </div>

        {/* Middle row - Field Overview */}
        <div className="lg:col-span-3">
          <FieldOverview
            fields={fields}
            onAddField={onAddField}
            onFieldClick={onFieldClick}
          />
        </div>

        {/* Bottom row - Role Specific Panel */}
        <div className="lg:col-span-3">
          <RoleSpecificPanel userRole={userRole} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
