import { supabase } from "./supabase";

export const updateWeather = async () => {
  try {
    const { data, error } = await supabase.functions.invoke("update_weather");

    if (error) {
      console.error("Error updating weather:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error calling update_weather function:", err);
    return { success: false, error: err };
  }
};
