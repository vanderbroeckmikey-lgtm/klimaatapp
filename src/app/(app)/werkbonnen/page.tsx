"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Werkbon = {
  id: string;
  bonnummer: string | null;
  type: string;
  status: string;
  datum: string;
  monteur: string | null;
  melding: string | null;
  klant_id: string;
  installatie_id: string | null;
};

export default function WerkbonnenPage() {
  const supabase = createClient();

  const [werkbonnen, setWerkbonnen] = useState<Werkbon[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    async function loadWerkbonnen() {
      const { data, error } = await supabase
        .from("werkbonnen")
        .select(
          "id, bonnummer, type, status, datum, monteur, melding, klant_id, installatie_id"
        )
        .order("created_at", { ascending: false });

      if (error) {
        setFout(error.message);
      } else {
        setWerkbonnen(data || []);
      }

      setLaden(false);
    }

    loadWerkbonnen();
  }, [supabase]);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Werkbonnen</h1>
          <p className="mt-2 text-gray-600">
            Overzicht van storingen, onderhoud en inbedrijfstellingen.
          </p>
        </div>
      </div>

      {fout && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {fout}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {laden ? (
          <p>Werkbonnen laden...</p>
        ) : werkbonnen.length === 0 ? (
          <p>Nog geen werkbonnen aangemaakt.</p>
        ) : (
          <div className="grid gap-4">
            {werkbonnen.map((werkbon) => (
              <div
                key={werkbon.id}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {werkbon.bonnummer || "Zonder bonnummer"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Type: {werkbon.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {werkbon.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Datum: {werkbon.datum}
                    </p>
                    <p className="text-sm text-gray-600">
                      Monteur: {werkbon.monteur || "-"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Melding: {werkbon.melding || "-"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/werkbonnen/${werkbon.id}`}
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100 transition"
                    >
                      Openen
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}