"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const koudemiddelen = [
  "R32",
  "R410A",
  "R407C",
  "R290",
  "R134a",
  "R404A",
  "R1234yf",
];

export default function NieuweCilinderPage() {

  const supabase = createClient();

  const [type, setType] = useState("R32");
  const [code, setCode] = useState("");
  const [startgewicht, setStartgewicht] = useState("");
  const [leeggewicht, setLeeggewicht] = useState("");
  const [melding, setMelding] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("koudemiddel_cilinders")
      .insert([
        {
          koudemiddel_type: type,
          cilinder_code: code || null,
          startgewicht_kg: Number(startgewicht),
          huidig_gewicht_kg: Number(startgewicht),
          leeggewicht_kg: leeggewicht ? Number(leeggewicht) : null,
        },
      ]);

    if (error) {
      setMelding(error.message);
      return;
    }

    window.location.href = "/koudemiddel";
  }

  return (
    <main className="max-w-2xl space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Nieuwe cilinder
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-4"
      >

        <div>
          <label>Koudemiddel</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            {koudemiddelen.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Cilinder code</label>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Bijv. R32-01"
          />
        </div>

        <div>
          <label>Startgewicht (kg)</label>

          <input
            type="number"
            step="0.01"
            value={startgewicht}
            onChange={(e) => setStartgewicht(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label>Leeggewicht (kg)</label>

          <input
            type="number"
            step="0.01"
            value={leeggewicht}
            onChange={(e) => setLeeggewicht(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-3 rounded-lg"
        >
          Cilinder opslaan
        </button>

        {melding && (
          <p className="text-red-600">{melding}</p>
        )}
      </form>

    </main>
  );
}