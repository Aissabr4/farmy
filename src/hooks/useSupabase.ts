import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  tableName: string,
  options?: {
    column?: string;
    value?: any;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    select?: string;
  },
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(tableName).select(options?.select || "*");

        if (options?.column && options?.value !== undefined) {
          query = query.eq(options.column, options.value);
        }

        if (options?.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending ?? false,
          });
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;
        setData(result as T[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`${tableName}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          // Refresh data when changes occur
          fetchData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [
    tableName,
    options?.column,
    options?.value,
    options?.orderBy,
    options?.ascending,
    options?.limit,
    options?.select,
  ]);

  return { data, loading, error };
}

// Specific hooks for different tables
export function useUsers() {
  return useSupabaseQuery("users", { orderBy: "date_added", ascending: false });
}

export function useFields() {
  return useSupabaseQuery("fields", { orderBy: "name", ascending: true });
}

export function useTasks(status?: string) {
  return useSupabaseQuery("tasks", {
    column: status && status !== "all" ? "status" : undefined,
    value: status && status !== "all" ? status : undefined,
    orderBy: "due_date",
    ascending: true,
  });
}

export function useNotifications(userId?: string) {
  return useSupabaseQuery("notifications", {
    column: userId ? "user_id" : undefined,
    value: userId,
    orderBy: "time",
    ascending: false,
  });
}

export function useWeatherData() {
  return useSupabaseQuery("weather_data", {
    orderBy: "recorded_at",
    ascending: false,
    limit: 1,
  });
}

export function useWeatherForecast() {
  return useSupabaseQuery("weather_forecast");
}

export function useSystemStatus() {
  return useSupabaseQuery("system_status");
}

export function useDiagnosticResults() {
  return useSupabaseQuery("diagnostic_results", {
    orderBy: "timestamp",
    ascending: false,
  });
}

export function useMaintenanceTasks() {
  return useSupabaseQuery("maintenance_tasks");
}

export function useSoilData(fieldId?: string) {
  return useSupabaseQuery("soil_data", {
    column: fieldId ? "field_id" : undefined,
    value: fieldId,
    orderBy: "recorded_at",
    ascending: false,
    limit: fieldId ? 1 : undefined,
  });
}

export function useCropHistory(fieldId?: string) {
  return useSupabaseQuery("crop_history", {
    column: fieldId ? "field_id" : undefined,
    value: fieldId,
    orderBy: "year",
    ascending: false,
  });
}
