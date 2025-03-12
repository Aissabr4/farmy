import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  title?: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({
  title = "Dashboard",
  userName = "John Farmer",
  userRole = "Owner",
  userAvatar = "",
  notificationCount = 3,
  onSearch = () => console.log("Search clicked"),
  onNotificationsClick = () => console.log("Notifications clicked"),
  onProfileClick = () => console.log("Profile clicked"),
  onSettingsClick = () => console.log("Settings clicked"),
  onLogoutClick = () => console.log("Logout clicked"),
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="w-full h-20 px-6 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-64">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </form>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onNotificationsClick}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-auto py-2"
            >
              <Avatar className="h-8 w-8">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {userName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
