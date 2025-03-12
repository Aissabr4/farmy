import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader } from "lucide-react";

class InitializeDatabase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      status: "idle",
      message: "",
    };
  }

  async initializeDatabase() {
    this.setState({
      loading: true,
      status: "loading",
      message: "Initializing database...",
    });

    try {
      // Check if users table exists and has data
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("count")
        .single();

      if (usersError && usersError.code !== "PGRST116") {
        // If error is not "no rows returned" error
        throw usersError;
      }

      // If users table has data, skip initialization
      if (usersData && usersData.count > 0) {
        this.setState({
          message: "Database already initialized with data.",
          status: "success",
        });
        return;
      }

      // Seed users table
      const { error: insertUsersError } = await supabase.from("users").insert([
        {
          name: "John Farmer",
          email: "john@farmmanager.com",
          role: "owner",
          status: "active",
          permissions: ["all"],
        },
        {
          name: "Sarah Smith",
          email: "sarah@farmmanager.com",
          role: "worker",
          status: "active",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          permissions: ["view_fields", "edit_tasks"],
        },
        {
          name: "Mike Johnson",
          email: "mike@farmmanager.com",
          role: "technician",
          status: "active",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          permissions: ["view_diagnostics", "edit_equipment"],
        },
        {
          name: "Emily Brown",
          email: "emily@farmmanager.com",
          role: "worker",
          status: "inactive",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          permissions: ["view_fields"],
        },
        {
          name: "David Wilson",
          email: "david@farmmanager.com",
          role: "technician",
          status: "active",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          permissions: ["view_diagnostics"],
        },
      ]);

      if (insertUsersError) throw insertUsersError;

      // Seed fields table
      const { error: insertFieldsError } = await supabase
        .from("fields")
        .insert([
          {
            name: "North Field",
            location: "Section A, North-East Corner",
            size: 12.5,
            crop_type: "Corn",
            status: "healthy",
            soil_moisture: 75,
            sunlight: 85,
            growth_stage: "Mature",
            planting_date: "2023-04-15",
            harvest_date: "2023-09-30",
          },
          {
            name: "South Field",
            location: "Section B, South Corner",
            size: 8.3,
            crop_type: "Wheat",
            status: "warning",
            soil_moisture: 45,
            sunlight: 90,
            growth_stage: "Growing",
            planting_date: "2023-05-10",
            harvest_date: "2023-10-15",
          },
          {
            name: "East Field",
            location: "Section C, East Side",
            size: 15.7,
            crop_type: "Soybeans",
            status: "critical",
            soil_moisture: 30,
            sunlight: 65,
            growth_stage: "Early",
            planting_date: "2023-06-01",
            harvest_date: "2023-11-05",
          },
          {
            name: "West Field",
            location: "Section D, West Side",
            size: 10.2,
            crop_type: "Barley",
            status: "healthy",
            soil_moisture: 80,
            sunlight: 75,
            growth_stage: "Mature",
            planting_date: "2023-03-20",
            harvest_date: "2023-08-15",
          },
        ]);

      if (insertFieldsError) throw insertFieldsError;

      // Seed tasks table
      const { error: insertTasksError } = await supabase.from("tasks").insert([
        {
          title: "Irrigation Check",
          description: "Check irrigation system in North Field",
          field_name: "North Field",
          assigned_to_name: "John Doe",
          due_date: new Date(Date.now() + 86400000), // tomorrow
          priority: "high",
          status: "pending",
        },
        {
          title: "Fertilizer Application",
          description: "Apply nitrogen fertilizer to East Field",
          field_name: "East Field",
          assigned_to_name: "Sarah Smith",
          due_date: new Date(Date.now() + 172800000), // 2 days from now
          priority: "medium",
          status: "in-progress",
        },
        {
          title: "Harvest Preparation",
          description: "Prepare equipment for upcoming harvest",
          field_name: "South Field",
          assigned_to_name: "Mike Johnson",
          due_date: new Date(Date.now() + 432000000), // 5 days from now
          priority: "low",
          status: "pending",
        },
      ]);

      if (insertTasksError) throw insertTasksError;

      // Seed weather_data table
      const { error: insertWeatherError } = await supabase
        .from("weather_data")
        .insert({
          temperature: 24,
          humidity: 65,
          wind_speed: 12,
          condition: "sunny",
          location: "Farm Location",
        });

      if (insertWeatherError) throw insertWeatherError;

      // Seed weather_forecast table
      const { error: insertForecastError } = await supabase
        .from("weather_forecast")
        .insert([
          { day: "Mon", temperature: 25, condition: "sunny" },
          { day: "Tue", temperature: 23, condition: "cloudy" },
          { day: "Wed", temperature: 22, condition: "rainy" },
          { day: "Thu", temperature: 24, condition: "sunny" },
          { day: "Fri", temperature: 26, condition: "sunny" },
        ]);

      if (insertForecastError) throw insertForecastError;

      this.setState({
        message: "Database initialized successfully!",
        status: "success",
      });
      return true;
    } catch (error) {
      console.error("Error initializing database:", error);
      this.setState({
        message: `Error initializing database: ${error.message}`,
        status: "error",
      });
      return false;
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<
      "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    const initializeDatabase = async () => {
      setLoading(true);
      setStatus("loading");
      setMessage("Initializing database...");

      try {
        // Check if users table exists and has data
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("count")
          .single();

        if (usersError && usersError.code !== "PGRST116") {
          // If error is not "no rows returned" error
          throw usersError;
        }

        // If users table has data, skip initialization
        if (usersData && usersData.count > 0) {
          setMessage("Database already initialized with data.");
          setStatus("success");
          return;
        }

        // Seed users table
        const { error: insertUsersError } = await supabase
          .from("users")
          .insert([
            {
              name: "John Farmer",
              email: "john@farmmanager.com",
              role: "owner",
              status: "active",
              permissions: ["all"],
            },
            {
              name: "Sarah Smith",
              email: "sarah@farmmanager.com",
              role: "worker",
              status: "active",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              permissions: ["view_fields", "edit_tasks"],
            },
            {
              name: "Mike Johnson",
              email: "mike@farmmanager.com",
              role: "technician",
              status: "active",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
              permissions: ["view_diagnostics", "edit_equipment"],
            },
            {
              name: "Emily Brown",
              email: "emily@farmmanager.com",
              role: "worker",
              status: "inactive",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
              permissions: ["view_fields"],
            },
            {
              name: "David Wilson",
              email: "david@farmmanager.com",
              role: "technician",
              status: "active",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
              permissions: ["view_diagnostics"],
            },
          ]);

        if (insertUsersError) throw insertUsersError;

        // Seed fields table
        const { error: insertFieldsError } = await supabase
          .from("fields")
          .insert([
            {
              name: "North Field",
              location: "Section A, North-East Corner",
              size: 12.5,
              crop_type: "Corn",
              status: "healthy",
              soil_moisture: 75,
              sunlight: 85,
              growth_stage: "Mature",
              planting_date: "2023-04-15",
              harvest_date: "2023-09-30",
            },
            {
              name: "South Field",
              location: "Section B, South Corner",
              size: 8.3,
              crop_type: "Wheat",
              status: "warning",
              soil_moisture: 45,
              sunlight: 90,
              growth_stage: "Growing",
              planting_date: "2023-05-10",
              harvest_date: "2023-10-15",
            },
            {
              name: "East Field",
              location: "Section C, East Side",
              size: 15.7,
              crop_type: "Soybeans",
              status: "critical",
              soil_moisture: 30,
              sunlight: 65,
              growth_stage: "Early",
              planting_date: "2023-06-01",
              harvest_date: "2023-11-05",
            },
            {
              name: "West Field",
              location: "Section D, West Side",
              size: 10.2,
              crop_type: "Barley",
              status: "healthy",
              soil_moisture: 80,
              sunlight: 75,
              growth_stage: "Mature",
              planting_date: "2023-03-20",
              harvest_date: "2023-08-15",
            },
          ]);

        if (insertFieldsError) throw insertFieldsError;

        // Seed tasks table
        const { error: insertTasksError } = await supabase
          .from("tasks")
          .insert([
            {
              title: "Irrigation Check",
              description: "Check irrigation system in North Field",
              field_name: "North Field",
              assigned_to_name: "John Doe",
              due_date: new Date(Date.now() + 86400000), // tomorrow
              priority: "high",
              status: "pending",
            },
            {
              title: "Fertilizer Application",
              description: "Apply nitrogen fertilizer to East Field",
              field_name: "East Field",
              assigned_to_name: "Sarah Smith",
              due_date: new Date(Date.now() + 172800000), // 2 days from now
              priority: "medium",
              status: "in-progress",
            },
            {
              title: "Harvest Preparation",
              description: "Prepare equipment for upcoming harvest",
              field_name: "South Field",
              assigned_to_name: "Mike Johnson",
              due_date: new Date(Date.now() + 432000000), // 5 days from now
              priority: "low",
              status: "pending",
            },
          ]);

        if (insertTasksError) throw insertTasksError;

        // Seed weather_data table
        const { error: insertWeatherError } = await supabase
          .from("weather_data")
          .insert({
            temperature: 24,
            humidity: 65,
            wind_speed: 12,
            condition: "sunny",
            location: "Farm Location",
          });

        if (insertWeatherError) throw insertWeatherError;

        // Seed weather_forecast table
        const { error: insertForecastError } = await supabase
          .from("weather_forecast")
          .insert([
            { day: "Mon", temperature: 25, condition: "sunny" },
            { day: "Tue", temperature: 23, condition: "cloudy" },
            { day: "Wed", temperature: 22, condition: "rainy" },
            { day: "Thu", temperature: 24, condition: "sunny" },
            { day: "Fri", temperature: 26, condition: "sunny" },
          ]);

        if (insertForecastError) throw insertForecastError;

        setMessage("Database initialized successfully!");
        setStatus("success");
      } catch (error) {
        console.error("Error initializing database:", error);
        setMessage(`Error initializing database: ${error.message}`);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Database Initialization</CardTitle>
          <CardDescription>
            Initialize your Supabase database with sample data for the Farm
            Management application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {this.state.status === "loading" ? (
            <div className="flex items-center justify-center py-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3">{this.state.message}</p>
            </div>
          ) : this.state.status === "success" ? (
            <div className="py-4 text-green-600">{this.state.message}</div>
          ) : this.state.status === "error" ? (
            <div className="py-4 text-red-600">{this.state.message}</div>
          ) : (
            <p className="py-4">
              Click the button below to initialize your database with sample
              data.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => this.initializeDatabase()}
            disabled={this.state.loading || this.state.status === "success"}
            className="w-full"
          >
            {this.state.loading
              ? "Initializing..."
              : this.state.status === "success"
                ? "Initialized"
                : "Initialize Database"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
}

export default InitializeDatabase;
