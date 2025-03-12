import React, { useState, useCallback, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardContent from "./dashboard/DashboardContent";
import FieldManagement from "./fields/FieldManagement";
import UserManagement from "./users/UserManagement";
import TaskManagement from "./tasks/TaskManagement";
import TechnicalDiagnostics from "./diagnostics/TechnicalDiagnostics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for user role selection
  const [userRole, setUserRole] = useState<"Owner" | "Worker" | "Technician">(
    "Owner",
  );

  // State for notifications and alerts
  const [notificationCount, setNotificationCount] = useState(3);
  const [alertCount, setAlertCount] = useState(1);

  // State for dialogs
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Determine active page based on current route
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActivePage("dashboard");
    } else if (path.startsWith("/fields")) {
      setActivePage("fields");
    } else if (path.startsWith("/users")) {
      setActivePage("users");
    } else if (path.startsWith("/tasks")) {
      setActivePage("tasks");
    } else if (path.startsWith("/diagnostics")) {
      setActivePage("diagnostics");
    } else if (path.startsWith("/equipment")) {
      setActivePage("equipment");
    }
  }, [location.pathname]);

  // Handler functions
  const handleSearch = useCallback((query: string) => {
    console.log(`Searching for: ${query}`);
    if (query.trim()) {
      alert(`Searching for: ${query}`);
    }
  }, []);

  const handleNotificationsClick = useCallback(() => {
    console.log("Notifications clicked");
    // Show notifications panel (in a real app)
    alert("Notifications panel opened");
  }, []);

  const handleProfileClick = useCallback(() => {
    console.log("Profile clicked");
    // In a real app, this would navigate to profile page
  }, []);

  const handleSettingsClick = useCallback(() => {
    console.log("Settings clicked");
    setIsSettingsOpen(true);
    // In a real app, this would navigate to settings page
  }, []);

  const handleLogoutClick = useCallback(() => {
    console.log("Logout clicked");
    setIsLogoutOpen(true);
    // In a real app, this would handle logout logic
  }, []);

  const handleRoleChange = useCallback(
    (role: "Owner" | "Worker" | "Technician") => {
      setUserRole(role);
    },
    [],
  );

  const handleNavigate = useCallback(
    (destination: string) => {
      console.log(`Navigating to ${destination}`);

      // Map destinations to actual routes
      switch (destination) {
        case "fields":
          navigate("/fields");
          break;
        case "users":
          navigate("/users");
          break;
        case "tasks":
          navigate("/tasks");
          break;
        case "diagnostics":
          navigate("/diagnostics");
          break;
        case "add-field":
          navigate("/fields");
          // In a real app, we would also trigger the add field dialog
          break;
        default:
          navigate("/");
      }
    },
    [navigate],
  );

  // Role selector component
  const RoleSelector = () => (
    <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md">
      <div className="flex gap-2">
        <button
          onClick={() => handleRoleChange("Owner")}
          className={`px-3 py-1 rounded-md ${userRole === "Owner" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Owner
        </button>
        <button
          onClick={() => handleRoleChange("Worker")}
          className={`px-3 py-1 rounded-md ${userRole === "Worker" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Worker
        </button>
        <button
          onClick={() => handleRoleChange("Technician")}
          className={`px-3 py-1 rounded-md ${userRole === "Technician" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Technician
        </button>
      </div>
    </div>
  );

  // Listen for help dialog event
  React.useEffect(() => {
    const handleOpenHelpDialog = () => {
      setIsHelpOpen(true);
    };

    window.addEventListener("openHelpDialog", handleOpenHelpDialog);

    return () => {
      window.removeEventListener("openHelpDialog", handleOpenHelpDialog);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      {/* Role selector for demo purposes */}
      <RoleSelector />

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Adjust your farm management settings here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Settings content would go here in a real application.</p>
            <p>
              You can customize your preferences, account details, and
              application settings.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>Get help with Farm Manager</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Help content would go here in a real application.</p>
            <p>
              You can find tutorials, FAQs, and contact support for assistance.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => setIsLogoutOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => {
                setIsLogoutOpen(false);
                // In a real app, this would perform actual logout
                console.log("User logged out");
              }}
            >
              Logout
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout
              userRole={userRole}
              activePage={activePage}
              notificationCount={notificationCount}
              alertCount={alertCount}
              onSearch={handleSearch}
              onNotificationsClick={handleNotificationsClick}
              onProfileClick={handleProfileClick}
              onSettingsClick={handleSettingsClick}
              onLogoutClick={handleLogoutClick}
            />
          }
        >
          <Route
            index
            element={
              <DashboardContent
                userRole={
                  userRole.toLowerCase() as "owner" | "worker" | "technician"
                }
                onNavigate={handleNavigate}
                onAddField={() => handleNavigate("add-field")}
                onFieldClick={(id) => console.log(`Field ${id} clicked`)}
                onMarkNotificationAsRead={(id) => {
                  console.log(`Marked notification ${id} as read`);
                  setNotificationCount((prev) => Math.max(0, prev - 1));
                  alert(`Notification ${id} marked as read`);
                }}
                onClearAllNotifications={() => {
                  console.log("Cleared all notifications");
                  setNotificationCount(0);
                  alert("All notifications cleared");
                }}
              />
            }
          />
          <Route
            path="fields/*"
            element={
              <FieldManagement
                onAddField={(field) => {
                  console.log("Add field:", field);
                  alert(`Field added: ${field.name || "New Field"}`);
                }}
                onEditField={(field) => {
                  console.log("Edit field:", field);
                  alert(`Field edited: ${field.name || field.id || "Field"}`);
                }}
                onDeleteField={(fieldId) => {
                  console.log("Delete field:", fieldId);
                  alert(`Field deleted: ${fieldId}`);
                }}
              />
            }
          />
          <Route
            path="users/*"
            element={
              <UserManagement
                onAddUser={(user) => {
                  console.log("Add user:", user);
                  alert(`User added: ${user.name}`);
                }}
                onEditUser={(id, user) => {
                  console.log(`Edit user ${id}:`, user);
                  alert(`User edited: ${user.name}`);
                }}
                onDeleteUser={(id) => {
                  console.log(`Delete user ${id}`);
                  alert(`User deleted: ${id}`);
                }}
                onUpdateStatus={(id, status) => {
                  console.log(`Update user ${id} status to ${status}`);
                  alert(`User ${id} status updated to ${status}`);
                }}
              />
            }
          />
          <Route
            path="tasks/*"
            element={
              <TaskManagement
                userRole={
                  userRole.toLowerCase() as "owner" | "worker" | "technician"
                }
                onTaskCreate={(task) => {
                  console.log("Task created:", task);
                  alert(`Task created: ${task.title || "New Task"}`);
                }}
                onTaskUpdate={(id, updates) => {
                  console.log(`Task ${id} updated:`, updates);
                  alert(`Task ${id} updated`);
                }}
                onTaskDelete={(id) => {
                  console.log(`Task ${id} deleted`);
                  alert(`Task ${id} deleted`);
                }}
              />
            }
          />
          <Route
            path="diagnostics/*"
            element={
              <TechnicalDiagnostics
                onRunDiagnostics={() => {
                  console.log("Running diagnostics");
                  alert("Diagnostics running...");
                  setTimeout(() => alert("Diagnostics completed"), 1500);
                }}
                onScheduleMaintenance={(systemId) => {
                  console.log(`Scheduling maintenance for ${systemId}`);
                  alert(`Maintenance scheduled for system ${systemId}`);
                }}
                onViewSystemDetails={(systemId) => {
                  console.log(`Viewing details for ${systemId}`);
                  alert(`Viewing details for system ${systemId}`);
                }}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Home;
