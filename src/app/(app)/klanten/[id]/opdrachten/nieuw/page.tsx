"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NieuweOpdrachtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  
  const [titel, setTitel] = useState("");
  const [status, setStatus] = useState("nieuw");
  const [uitvoerdatum, setUitvoerdatum] = useState("");
  const [omschrijving, setOmschrijving] = useState("");
  const [melding, setMelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaan(true);
    setMelding("");

    const { id } = await params;

    const { error } = await supabase.from("opdrachten").insert([
      {
        klant_id: id,
        titel,
        status,
        uitvoerdatum: uitvoerdatum || null,
        omschrijving,
      },
    ]);

    setOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    window.location.href = `/klanten/${id}`;
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Nieuwe opdracht</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="Titel van de opdracht"
          className="w-full border rounded-lg p-3"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="nieuw">Nieuw</option>
          <option value="ingepland">Ingepland</option>
          <option value="uitgevoerd">Uitgevoerd</option>
          <option value="offerte">Offerte</option>
          <option value="storing">Storing</option>
        </select>

        <input
          type="date"
          value={uitvoerdatum}
          onChange={(e) => setUitvoerdatum(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={omschrijving}
          onChange={(e) => setOmschrijving(e.target.value)}
          placeholder="Omschrijving van de werkzaamheden"
          className="w-full border rounded-lg p-3 min-h-32"
        />

        <button
          type="submit"
          disabled={opslaan}
          className="bg-black text-white rounded-lg px-4 py-3"
        >
          {opslaan ? "Opslaan..." : "Opdracht opslaan"}
        </button>
      </form>

      {melding && <p className="mt-4 text-red-600">{melding}</p>}
    </main>
  );
}