import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Home,
  LayoutGrid,
  Users,
  ClipboardList,
  Settings,
  HelpCircle,
  LogOut,
  AlertTriangle,
  Bell,
  Tractor,
} from "lucide-react";

interface SidebarProps {
  userRole?: "Owner" | "Worker" | "Technician";
  userName?: string;
  userAvatar?: string;
  activePage?: string;
  notifications?: number;
  alerts?: number;
  onNotificationsClick?: () => void;
  onAlertsClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogoutClick?: () => void;
}

const Sidebar = ({
  userRole = "Owner",
  userName = "John Farmer",
  userAvatar = "",
  activePage = "dashboard",
  notifications = 3,
  alerts = 1,
  onNotificationsClick = () => console.log("Notifications clicked"),
  onAlertsClick = () => console.log("Alerts clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
  onHelpClick = () => console.log("Help clicked"),
  onLogoutClick = () => console.log("Logout clicked"),
}: SidebarProps) => {
  const navigate = useNavigate();

  // Navigation items based on user role
  const navigationItems = {
    Owner: [
      { name: "Dashboard", path: "/", icon: <Home size={20} /> },
      { name: "Fields", path: "/fields", icon: <LayoutGrid size={20} /> },
      { name: "Users", path: "/users", icon: <Users size={20} /> },
      { name: "Tasks", path: "/tasks", icon: <ClipboardList size={20} /> },
    ],
    Worker: [
      { name: "Dashboard", path: "/", icon: <Home size={20} /> },
      { name: "Tasks", path: "/tasks", icon: <ClipboardList size={20} /> },
      { name: "Equipment", path: "/equipment", icon: <Tractor size={20} /> },
    ],
    Technician: [
      { name: "Dashboard", path: "/", icon: <Home size={20} /> },
      {
        name: "Diagnostics",
        path: "/diagnostics",
        icon: <AlertTriangle size={20} />,
      },
      { name: "Equipment", path: "/equipment", icon: <Tractor size={20} /> },
    ],
  };

  // Get navigation items for current user role
  const navItems = navigationItems[userRole] || [];

  // Handle navigation
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="w-[280px] h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo and brand */}
      <div className="p-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold">FM</span>
          </div>
          <h1 className="text-xl font-bold">Farm Manager</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Grow smarter, not harder</p>
      </div>

      <Separator />

      {/* Main navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={
                activePage === item.name.toLowerCase() ? "secondary" : "ghost"
              }
              className={cn(
                "w-full justify-start",
                activePage === item.name.toLowerCase()
                  ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                  : "text-gray-600 hover:bg-gray-100",
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Button>
          ))}
        </div>

        {/* Notifications and alerts section */}
        <div className="mt-6">
          <h3 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">
            Notifications
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100"
              onClick={onNotificationsClick}
            >
              <span className="mr-3">
                <Bell size={20} />
              </span>
              Notifications
              {notifications > 0 && (
                <Badge className="ml-auto bg-blue-500">{notifications}</Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-gray-100"
              onClick={onAlertsClick}
            >
              <span className="mr-3">
                <AlertTriangle size={20} />
              </span>
              Alerts
              {alerts > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {alerts}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <Separator />

      {/* User profile and settings */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            {userAvatar ? (
              <AvatarImage src={userAvatar} alt={userName} />
            ) : (
              <AvatarFallback className="bg-green-100 text-green-800">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium text-sm">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
            onClick={onSettingsClick}
          >
            <span className="mr-3">
              <Settings size={18} />
            </span>
            Settings
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:bg-gray-100"
                  onClick={onHelpClick}
                >
                  <span className="mr-3">
                    <HelpCircle size={18} />
                  </span>
                  Help & Support
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Get help with Farm Manager</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
            onClick={onLogoutClick}
          >
            <span className="mr-3">
              <LogOut size={18} />
            </span>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
