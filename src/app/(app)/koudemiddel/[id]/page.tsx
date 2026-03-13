"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Cilinder = {
  id: string;
  cilinder_code: string | null;
  koudemiddel_type: string;
  huidig_gewicht_kg: number;
};

type Mutatie = {
  id: string;
  created_at: string;
  type: string;
  hoeveelheid_kg: number;
  opmerking: string | null;
};

export default function CilinderDetail() {

  const supabase = createClient();
  const params = useParams();

  const [cilinder, setCilinder] = useState<Cilinder | null>(null);
  const [mutaties, setMutaties] = useState<Mutatie[]>([]);

  const [kg, setKg] = useState("");
  const [opmerking, setOpmerking] = useState("");

  async function load() {

    const { data: cilinderData } = await supabase
      .from("cilinder_voorraad")
      .select("*")
      .eq("id", params.id)
      .single();

    const { data: mutatieData } = await supabase
      .from("koudemiddel_mutaties")
      .select("*")
      .eq("cilinder_id", params.id)
      .order("created_at", { ascending: false });

    setCilinder(cilinderData);
    setMutaties(mutatieData || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function voegMutatieToe(e: React.FormEvent) {

    e.preventDefault();

    const waarde = Number(kg);

    if (isNaN(waarde)) {
      alert("Ongeldig gewicht");
      return;
    }

    const type = waarde < 0 ? "verbruikt" : "gevuld";

    const { error } = await supabase
      .from("koudemiddel_mutaties")
      .insert({
        cilinder_id: params.id,
        type: type,
        hoeveelheid_kg: waarde,
        opmerking: opmerking
      });

    if (error) {
      alert("Mutatie opslaan mislukt");
      return;
    }

    setKg("");
    setOpmerking("");

    load();
  }

  if (!cilinder) return <p>Laden...</p>;

  return (
    <main className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          {cilinder.koudemiddel_type}
        </h1>

        <p className="text-gray-600">
          Cilinder: {cilinder.cilinder_code || "-"}
        </p>

        <p className="text-xl font-semibold mt-2">
          Huidig gewicht: {Number(cilinder.huidig_gewicht_kg).toFixed(2)} kg
        </p>

      </div>

      <section className="bg-white border rounded-xl p-6">

        <h2 className="font-semibold mb-4">
          Mutatie toevoegen
        </h2>

        <form
          onSubmit={voegMutatieToe}
          className="flex gap-3"
        >

          <input
            type="number"
            step="0.01"
            placeholder="kg (+ vullen / - verbruik)"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            placeholder="Opmerking"
            value={opmerking}
            onChange={(e) => setOpmerking(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Opslaan
          </button>

        </form>

      </section>

      <section className="bg-white border rounded-xl p-6">

        <h2 className="font-semibold mb-4">
          Mutatie historie
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Datum</th>
              <th>Type</th>
              <th>Kg</th>
              <th>Opmerking</th>
            </tr>
          </thead>

          <tbody>

            {mutaties.map((m) => (

              <tr key={m.id} className="border-b">

                <td className="py-2">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>

                <td>{m.type}</td>

                <td>{m.hoeveelheid_kg}</td>

                <td>{m.opmerking}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

    </main>
  );
}