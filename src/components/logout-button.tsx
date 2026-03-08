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
      className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
    >
      Uitloggen
    </button>
  );
}