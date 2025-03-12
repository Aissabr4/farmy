import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Generate random weather data
    const conditions = ["sunny", "cloudy", "rainy", "foggy", "snowy"];
    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 30) + 10; // 10-40°C
    const humidity = Math.floor(Math.random() * 60) + 30; // 30-90%
    const windSpeed = Math.floor(Math.random() * 20) + 5; // 5-25 km/h

    // Update weather data
    const { data, error } = await supabaseClient
      .from("weather_data")
      .insert({
        temperature,
        humidity,
        wind_speed: windSpeed,
        condition: randomCondition,
        location: "Farm Location",
      })
      .select();

    if (error) throw error;

    // Update forecast
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const forecastData = days.map((day) => ({
      day,
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    }));

    // Clear existing forecast and add new one
    await supabaseClient
      .from("weather_forecast")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: forecastError } = await supabaseClient
      .from("weather_forecast")
      .insert(forecastData);

    if (forecastError) throw forecastError;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
