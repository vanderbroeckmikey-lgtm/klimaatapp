"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Klant = {
  id: string;
  naam: string;
  email: string | null;
  telefoon: string | null;
  plaats: string | null;
};

export default function KlantenPage() {
  const supabase = createClient();

  const [klanten, setKlanten] = useState<Klant[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    async function loadKlanten() {
      const { data, error } = await supabase
        .from("klanten")
        .select("id, naam, email, telefoon, plaats")
        .order("created_at", { ascending: false });

      if (error) {
        setFout(error.message);
      } else {
        setKlanten(data || []);
      }

      setLaden(false);
    }

    loadKlanten();
  }, [supabase]);

  async function verwijderKlant(id: string) {
    const confirmDelete = confirm(
      "Weet je zeker dat je deze klant wilt verwijderen?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("klanten")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Verwijderen mislukt: " + error.message);
    } else {
      setKlanten((prev) => prev.filter((k) => k.id !== id));
    }
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Klanten</h1>

        <Link
          href="/klanten/nieuw"
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Nieuwe klant
        </Link>
      </div>

      {laden && <p>Klanten laden...</p>}
      {fout && <p className="text-red-600">{fout}</p>}
      {!laden && klanten.length === 0 && (
        <p>Nog geen klanten toegevoegd.</p>
      )}

      <div className="grid gap-4">
        {klanten.map((klant) => (
          <div
            key={klant.id}
            className="border rounded-xl p-4 bg-white flex justify-between items-start hover:shadow transition"
          >
            <div>
              <h2 className="font-semibold text-lg">{klant.naam}</h2>

              <p className="text-sm text-gray-600">
                {klant.email || "Geen e-mail"}
              </p>

              <p className="text-sm text-gray-600">
                {klant.telefoon || "Geen telefoon"}
              </p>

              <p className="text-sm text-gray-600">
                {klant.plaats || "Geen plaats"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/klanten/${klant.id}`}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Bewerken
              </Link>

              <button
                onClick={() => verwijderKlant(klant.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}