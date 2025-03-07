"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(error.message);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to the Admin Panel
          </h2>
          <p className="text-gray-600">
            This is a protected page that can only be accessed by authenticated
            users.
          </p>
        </div>
      </div>
    </div>
  );
}
