import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Filter,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "task" | "info";
  status?: "pending" | "completed";
  priority?: "low" | "medium" | "high";
  read: boolean;
}

interface NotificationPanelProps {
  notifications?: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
  onFilterChange?: (filter: string) => void;
}

const NotificationPanel = ({
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
    {
      id: "4",
      title: "System Update",
      message: "Farm management system updated to version 2.3",
      time: "Yesterday",
      type: "info",
      read: true,
    },
    {
      id: "5",
      title: "Crop Health Alert",
      message: "Possible pest detection in South Field",
      time: "Yesterday",
      type: "alert",
      priority: "medium",
      read: false,
    },
  ],
  onMarkAsRead = (id) => console.log(`Marked notification ${id} as read`),
  onClearAll = () => console.log("Cleared all notifications"),
  onFilterChange = (filter) => console.log(`Filter changed to ${filter}`),
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Get icon based on notification type
  const getNotificationIcon = (
    type: string,
    status?: string,
    priority?: string,
  ) => {
    switch (type) {
      case "alert":
        return (
          <AlertTriangle
            size={16}
            className={`${priority === "high" ? "text-red-500" : "text-yellow-500"}`}
          />
        );
      case "task":
        return status === "completed" ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <Clock size={16} className="text-blue-500" />
        );
      case "info":
        return <Info size={16} className="text-gray-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md h-[350px] overflow-hidden flex flex-col bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" onClick={() => onFilterChange("all")}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              onClick={() => onFilterChange("alerts")}
            >
              Alerts
            </TabsTrigger>
            <TabsTrigger value="tasks" onClick={() => onFilterChange("tasks")}>
              Tasks
            </TabsTrigger>
            <TabsTrigger value="info" onClick={() => onFilterChange("info")}>
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NotificationList
              notifications={notifications}
              getNotificationIcon={getNotificationIcon}
              onMarkAsRead={onMarkAsRead}
            />
          </TabsContent>

          <TabsContent value="alerts" className="mt-0">
            <NotificationList
              notifications={notifications.filter((n) => n.type === "alert")}
              getNotificationIcon={getNotificationIcon}
              onMarkAsRead={onMarkAsRead}
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <NotificationList
              notifications={notifications.filter((n) => n.type === "task")}
              getNotificationIcon={getNotificationIcon}
              onMarkAsRead={onMarkAsRead}
            />
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <NotificationList
              notifications={notifications.filter((n) => n.type === "info")}
              getNotificationIcon={getNotificationIcon}
              onMarkAsRead={onMarkAsRead}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="px-6 mt-auto pb-3 pt-2 border-t flex justify-between items-center">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter size={14} />
          Filter
        </Button>
        <Button variant="link" size="sm" className="text-xs">
          Settings
        </Button>
      </div>
    </Card>
  );
};

interface NotificationListProps {
  notifications: NotificationItem[];
  getNotificationIcon: (
    type: string,
    status?: string,
    priority?: string,
  ) => React.ReactNode;
  onMarkAsRead: (id: string) => void;
}

const NotificationList = ({
  notifications,
  getNotificationIcon,
  onMarkAsRead,
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <Bell size={24} className="mx-auto mb-2 opacity-50" />
        <p>No notifications</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[210px] pr-1 -mr-1">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 mb-2 rounded-lg border ${notification.read ? "bg-white" : "bg-blue-50"} hover:bg-gray-50 cursor-pointer transition-colors`}
          onClick={() => onMarkAsRead(notification.id)}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getNotificationIcon(
                notification.type,
                notification.status,
                notification.priority,
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4
                  className={`text-sm font-medium truncate ${notification.read ? "text-gray-700" : "text-gray-900"}`}
                >
                  {notification.title}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {notification.time}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {notification.message}
              </p>

              {notification.type === "task" && (
                <div className="mt-1">
                  <Badge
                    variant={
                      notification.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className={`text-[10px] py-0 px-2 ${notification.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {notification.status === "completed"
                      ? "Completed"
                      : "Pending"}
                  </Badge>
                </div>
              )}

              {notification.priority && notification.type === "alert" && (
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 px-2 ${notification.priority === "high" ? "border-red-200 text-red-800" : "border-yellow-200 text-yellow-800"}`}
                  >
                    {notification.priority.charAt(0).toUpperCase() +
                      notification.priority.slice(1)}{" "}
                    Priority
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
