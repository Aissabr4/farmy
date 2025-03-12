import { supabase } from "./supabase";
import { Farm, User, Field } from "@/types/farm";

// Farm API
export const getFarms = async (): Promise<Farm[]> => {
  try {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching farms:", error);
    return [];
  }
};

export const getFarmById = async (id: string): Promise<Farm | null> => {
  try {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching farm ${id}:`, error);
    return null;
  }
};

export const createFarm = async (
  farmData: Partial<Farm>,
): Promise<Farm | null> => {
  try {
    const { data, error } = await supabase
      .from("farms")
      .insert(farmData)
      .select();

    if (error) throw error;
    return data[0] || null;
  } catch (error) {
    console.error("Error creating farm:", error);
    return null;
  }
};

export const updateFarm = async (
  id: string,
  updates: Partial<Farm>,
): Promise<Farm | null> => {
  try {
    const { data, error } = await supabase
      .from("farms")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0] || null;
  } catch (error) {
    console.error(`Error updating farm ${id}:`, error);
    return null;
  }
};

export const deleteFarm = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("farms").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting farm ${id}:`, error);
    return false;
  }
};

// Get users by farm ID
export const getUsersByFarmId = async (farmId: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("farm_id", farmId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching users for farm ${farmId}:`, error);
    return [];
  }
};

// Get fields by farm ID
export const getFieldsByFarmId = async (farmId: string): Promise<Field[]> => {
  try {
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("farm_id", farmId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching fields for farm ${farmId}:`, error);
    return [];
  }
};
