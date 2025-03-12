import { supabase } from "@/lib/supabase";

export interface UserData {
  name: string;
  email: string;
  role: "owner" | "worker" | "technician";
  status: "active" | "inactive";
  permissions?: string[];
  avatar?: string;
}

export const addUser = async (userData: UserData) => {
  try {
    // Generate avatar URL for non-owner users
    if (userData.role !== "owner" && !userData.avatar) {
      userData.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`;
    }

    // Add permissions array if not provided
    if (!userData.permissions) {
      userData.permissions = [];
    }

    // Insert user into the database
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        avatar: userData.avatar,
        permissions: userData.permissions,
      })
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error };
  }
};

export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("date_added", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (id: string, updates: Partial<UserData>) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
};
