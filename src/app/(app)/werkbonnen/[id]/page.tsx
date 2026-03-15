"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WerkbonPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [werkbon, setWerkbon] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("werkbonnen")
        .select("*")
        .eq("id", params.id)
        .single();

      setWerkbon(data);
    }

    load();
  }, [params.id]);

  async function verwijderen() {
    if (!confirm("Werkbon verwijderen?")) return;

    await supabase
      .from("werkbonnen")
      .delete()
      .eq("id", params.id);

    window.location.href = "/";
  }

  if (!werkbon) return <p>laden...</p>;

  return (
    <main className="max-w-3xl space-y-6">

      <h1 className="text-3xl font-bold">
        Werkbon {werkbon.bonnummer}
      </h1>

      <button
        onClick={verwijderen}
        className="bg-red-600 text-white px-4 py-2 rounded-xl"
      >
        Werkbon verwijderen
      </button>

    </main>
  );
}