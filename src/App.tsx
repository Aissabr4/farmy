import { Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import InitializeDatabase from "./components/InitializeDatabase";
import { supabase } from "./lib/supabase";

function App() {
  const [databaseInitialized, setDatabaseInitialized] = useState<
    boolean | null
  >(null);
  const [showInitializer, setShowInitializer] = useState(false);

  useEffect(() => {
    // Check if database has been initialized
    const checkDatabase = async () => {
      try {
        // Check if users table has data
        const { count, error } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error checking database:", error);
          setDatabaseInitialized(false);
          setShowInitializer(true);
          return;
        }

        setDatabaseInitialized(count > 0);
        setShowInitializer(count === 0);
      } catch (error) {
        console.error("Error checking database:", error);
        setDatabaseInitialized(false);
        setShowInitializer(true);
      }
    };

    checkDatabase();
  }, []);

  if (databaseInitialized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking database...
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {showInitializer ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <InitializeDatabase />
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/*" element={<Home />} />
          </Routes>
          {/* Tempo routes are now handled in main.tsx */}
        </>
      )}
    </Suspense>
  );
}

export default App;
