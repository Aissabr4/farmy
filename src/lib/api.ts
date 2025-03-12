import { supabase } from "./supabase";
import { Database } from "@/types/supabase";

// User API
export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createUser = async (userData: any) => {
  const { data, error } = await supabase
    .from("users")
    .insert(userData)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateUser = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// Field API
export const getFields = async () => {
  const { data, error } = await supabase.from("fields").select("*");
  if (error) throw error;
  return data;
};

export const getFieldById = async (id: string) => {
  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createField = async (fieldData: any) => {
  const { data, error } = await supabase
    .from("fields")
    .insert(fieldData)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateField = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("fields")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteField = async (id: string) => {
  const { error } = await supabase.from("fields").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// Task API
export const getTasks = async () => {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) throw error;
  return data;
};

export const getTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createTask = async (taskData: any) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(taskData)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateTask = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
};

// Notification API
export const getNotifications = async (userId?: string) => {
  let query = supabase.from("notifications").select("*");
  if (userId) {
    query = query.eq("user_id", userId);
  }
  const { data, error } = await query.order("time", { ascending: false });
  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (id: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const clearAllNotifications = async (userId: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId);
  if (error) throw error;
  return true;
};

export const createNotification = async (notificationData: any) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notificationData)
    .select();
  if (error) throw error;
  return data[0];
};

// Weather API
export const getWeatherData = async () => {
  const { data, error } = await supabase
    .from("weather_data")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
};

export const getWeatherForecast = async () => {
  const { data, error } = await supabase.from("weather_forecast").select("*");
  if (error) throw error;
  return data;
};

// System Status API
export const getSystemStatus = async () => {
  const { data, error } = await supabase.from("system_status").select("*");
  if (error) throw error;
  return data;
};

export const getDiagnosticResults = async () => {
  const { data, error } = await supabase
    .from("diagnostic_results")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return data;
};

export const getMaintenanceTasks = async () => {
  const { data, error } = await supabase.from("maintenance_tasks").select("*");
  if (error) throw error;
  return data;
};

// Soil Data API
export const getSoilDataForField = async (fieldId: string) => {
  const { data, error } = await supabase
    .from("soil_data")
    .select("*")
    .eq("field_id", fieldId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
};

// Crop History API
export const getCropHistoryForField = async (fieldId: string) => {
  const { data, error } = await supabase
    .from("crop_history")
    .select("*")
    .eq("field_id", fieldId)
    .order("year", { ascending: false });
  if (error) throw error;
  return data;
};
