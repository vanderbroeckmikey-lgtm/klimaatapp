"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
    >
      Uitloggen
    </button>
  );
}