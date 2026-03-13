"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Voorraad = {
  koudemiddel_type: string;
  totaal_kg: number;
};

export default function Dashboard() {
  const supabase = createClient();

  const [voorraad, setVoorraad] = useState<Voorraad[]>([]);

  async function load() {
    const { data } = await supabase
      .rpc("voorraad_per_type");

    setVoorraad(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="space-y-6">

      <h1 className="text-3xl font-bold">
        Voorraad dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {voorraad.map((v) => (

          <div
            key={v.koudemiddel_type}
            className="bg-white border rounded-xl p-6"
          >

            <h2 className="text-lg font-semibold">
              {v.koudemiddel_type}
            </h2>

            <p className="text-3xl font-bold mt-2">
              {v.totaal_kg.toFixed(2)} kg
            </p>

          </div>

        ))}

      </div>

    </main>
  );
}