import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  userRole?: "Owner" | "Worker" | "Technician";
  userName?: string;
  userAvatar?: string;
  activePage?: string;
  notificationCount?: number;
  alertCount?: number;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const DashboardLayout = ({
  userRole = "Owner",
  userName = "John Farmer",
  userAvatar = "",
  activePage: initialActivePage = "dashboard",
  notificationCount = 3,
  alertCount = 1,
  onSearch = () => console.log("Search clicked"),
  onNotificationsClick = () => console.log("Notifications clicked"),
  onProfileClick = () => console.log("Profile clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
  onLogoutClick = () => console.log("Logout clicked"),
}: DashboardLayoutProps) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(initialActivePage);

  // Update active page based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActivePage("dashboard");
    } else {
      // Remove leading slash and set as active page
      setActivePage(path.substring(1));
    }
  }, [location.pathname]);

  // Determine the current page title based on the active page
  const getPageTitle = () => {
    switch (activePage.toLowerCase()) {
      case "dashboard":
        return "Dashboard";
      case "fields":
        return "Field Management";
      case "users":
        return "User Management";
      case "tasks":
        return "Task Management";
      case "diagnostics":
        return "Technical Diagnostics";
      case "equipment":
        return "Equipment Management";
      default:
        return "Dashboard";
    }
  };

  // Handle alerts click
  const handleAlertsClick = () => {
    console.log("Alerts clicked");
    // Create a custom dialog instead of using alert
    const alertDialog = document.createElement("div");
    alertDialog.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    alertDialog.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-medium mb-2">Alerts</h3>
        <p class="mb-4">You have ${alertCount} unread alert(s).</p>
        <div class="border rounded-md p-3 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
            <p class="font-medium">System Alert</p>
          </div>
          <p class="text-sm text-gray-600 mt-1">Irrigation system pressure low in North Field</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md w-full" id="close-alert-dialog">Close</button>
      </div>
    `;
    document.body.appendChild(alertDialog);

    document
      .getElementById("close-alert-dialog")
      ?.addEventListener("click", () => {
        document.body.removeChild(alertDialog);
      });
  };

  // Handle help click
  const handleHelpClick = () => {
    console.log("Help clicked");
    // In a real app, this would open help documentation
    window.dispatchEvent(new CustomEvent("openHelpDialog"));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        activePage={activePage}
        notifications={notificationCount}
        alerts={alertCount}
        onNotificationsClick={onNotificationsClick}
        onAlertsClick={handleAlertsClick}
        onSettingsClick={onSettingsClick}
        onHelpClick={handleHelpClick}
        onLogoutClick={onLogoutClick}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          title={getPageTitle()}
          userName={userName}
          userRole={userRole}
          userAvatar={userAvatar}
          notificationCount={notificationCount}
          onSearch={onSearch}
          onNotificationsClick={onNotificationsClick}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onLogoutClick={onLogoutClick}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
