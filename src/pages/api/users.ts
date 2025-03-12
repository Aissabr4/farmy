import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET - Fetch all users
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("date_added", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - Create a new user
  if (req.method === "POST") {
    try {
      const userData = req.body;

      // Validate required fields
      if (
        !userData.name ||
        !userData.email ||
        !userData.role ||
        !userData.status
      ) {
        return res.status(400).json({ error: "Missing required fields" });
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
          permissions: userData.permissions || [],
        })
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT - Update a user
  if (req.method === "PUT") {
    try {
      const { id, ...updates } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - Delete a user
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}
