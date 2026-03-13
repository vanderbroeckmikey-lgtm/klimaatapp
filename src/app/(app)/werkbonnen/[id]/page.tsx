"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Werkbon = {
  id: string;
  klant: string;
  installatie: string;
  datum: string;
  status: string;
  opmerkingen: string | null;
};

export default function WerkbonDetailPage() {
  const supabase = createClient();
  const params = useParams(); // haalt [id] op uit URL
  const [werkbon, setWerkbon] = useState<Werkbon | null>(null);
  const [laden, setLaden] = useState(true);

  async function loadWerkbon() {
    const { data, error } = await supabase
      .from("werkbonnen")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Kan werkbon niet laden:", error);
      setLaden(false);
      return;
    }

    setWerkbon(data);
    setLaden(false);
  }

  useEffect(() => {
    loadWerkbon();
  }, [params.id]);

  if (laden) return <p>Laden...</p>;
  if (!werkbon) return <p>Werkbon niet gevonden.</p>;

  return (
    <main className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Werkbon {werkbon.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold">Klant:</span> {werkbon.klant}
          </p>
          <p>
            <span className="font-semibold">Installatie:</span> {werkbon.installatie}
          </p>
          <p>
            <span className="font-semibold">Datum:</span> {new Date(werkbon.datum).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Status:</span> {werkbon.status}
          </p>
          <p>
            <span className="font-semibold">Opmerkingen:</span> {werkbon.opmerkingen || "-"}
          </p>
        </div>
      </div>
    </main>
  );
}