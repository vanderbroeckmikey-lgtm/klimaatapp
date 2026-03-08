"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Cilinder = {
  id: string;
  cilinder_code: string | null;
  koudemiddel_type: string;
  startgewicht_kg: number;
  huidig_gewicht_kg: number;
  leeggewicht_kg: number | null;
  status: string;
};

export default function KoudemiddelPage() {
  const supabase = createClient();

  const [cilinders, setCilinders] = useState<Cilinder[]>([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("koudemiddel_cilinders")
        .select("*")
        .order("created_at", { ascending: false });

      setCilinders(data || []);
      setLaden(false);
    }

    load();
  }, [supabase]);

  return (
    <main className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Koudemiddelvoorraad</h1>
          <p className="text-gray-600">
            Overzicht van alle cilinders en voorraad.
          </p>
        </div>

        <Link
          href="/koudemiddel/nieuw"
          className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700"
        >
          Nieuwe cilinder
        </Link>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">

        {laden ? (
          <p>Laden...</p>
        ) : cilinders.length === 0 ? (
          <p>Nog geen cilinders toegevoegd.</p>
        ) : (
          <div className="grid gap-4">
            {cilinders.map((cilinder) => (
              <div
                key={cilinder.id}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between">

                  <div>
                    <h3 className="font-semibold text-lg">
                      {cilinder.koudemiddel_type}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Cilinder: {cilinder.cilinder_code || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Startgewicht: {cilinder.startgewicht_kg} kg
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {cilinder.huidig_gewicht_kg} kg
                    </p>

                    <p className="text-sm text-gray-600">
                      Status: {cilinder.status}
                    </p>
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