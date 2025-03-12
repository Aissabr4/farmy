import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import * as api from "@/lib/api";

interface DataContextType {
  users: any[];
  fields: any[];
  tasks: any[];
  notifications: any[];
  weatherData: any | null;
  weatherForecast: any[];
  systemStatus: any[];
  diagnosticResults: any[];
  maintenanceTasks: any[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  createUser: (userData: any) => Promise<any>;
  updateUser: (id: string, updates: any) => Promise<any>;
  deleteUser: (id: string) => Promise<boolean>;
  createField: (fieldData: any) => Promise<any>;
  updateField: (id: string, updates: any) => Promise<any>;
  deleteField: (id: string) => Promise<boolean>;
  createTask: (taskData: any) => Promise<any>;
  updateTask: (id: string, updates: any) => Promise<any>;
  deleteTask: (id: string) => Promise<boolean>;
  markNotificationAsRead: (id: string) => Promise<any>;
  clearAllNotifications: (userId: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any[]>([]);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        usersData,
        fieldsData,
        tasksData,
        notificationsData,
        weatherDataResult,
        weatherForecastData,
        systemStatusData,
        diagnosticResultsData,
        maintenanceTasksData,
      ] = await Promise.all([
        api.getUsers(),
        api.getFields(),
        api.getTasks(),
        api.getNotifications(),
        api.getWeatherData().catch(() => null),
        api.getWeatherForecast(),
        api.getSystemStatus(),
        api.getDiagnosticResults(),
        api.getMaintenanceTasks(),
      ]);

      setUsers(usersData);
      setFields(fieldsData);
      setTasks(tasksData);
      setNotifications(notificationsData);
      setWeatherData(weatherDataResult);
      setWeatherForecast(weatherForecastData);
      setSystemStatus(systemStatusData);
      setDiagnosticResults(diagnosticResultsData);
      setMaintenanceTasks(maintenanceTasksData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscriptions
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fields" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weather_data" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "weather_forecast" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_status" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "diagnostic_results" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "maintenance_tasks" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "soil_data" },
        fetchData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "crop_history" },
        fetchData,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value = {
    users,
    fields,
    tasks,
    notifications,
    weatherData,
    weatherForecast,
    systemStatus,
    diagnosticResults,
    maintenanceTasks,
    loading,
    error,
    refreshData: fetchData,
    createUser: api.createUser,
    updateUser: api.updateUser,
    deleteUser: api.deleteUser,
    createField: api.createField,
    updateField: api.updateField,
    deleteField: api.deleteField,
    createTask: api.createTask,
    updateTask: api.updateTask,
    deleteTask: api.deleteTask,
    markNotificationAsRead: api.markNotificationAsRead,
    clearAllNotifications: api.clearAllNotifications,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
