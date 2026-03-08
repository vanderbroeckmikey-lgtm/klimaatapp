"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Bestand = {
  id: string;
  bestandsnaam: string;
  opslag_pad: string;
  type: string | null;
};

export default function KlantBestandenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [klantId, setKlantId] = useState("");
  const [bestand, setBestand] = useState<File | null>(null);
  const [bestanden, setBestanden] = useState<Bestand[]>([]);
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(true);
  const [uploaden, setUploaden] = useState(false);

  async function loadBestanden(id: string) {
    const { data, error } = await supabase
      .from("bestanden")
      .select("id, bestandsnaam, opslag_pad, type")
      .eq("klant_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      setMelding(error.message);
    } else {
      setBestanden(data || []);
    }

    setLaden(false);
  }

  useEffect(() => {
    async function init() {
      const { id } = await params;
      setKlantId(id);
      await loadBestanden(id);
    }

    init();
  }, [params]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMelding("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMelding("Je bent niet ingelogd. Log eerst in.");
      return;
    }

    if (!bestand) {
      setMelding("Kies eerst een bestand.");
      return;
    }

    setUploaden(true);

    const ext = bestand.name.split(".").pop();
    const bestandsnaam = `${Date.now()}-${bestand.name}`;
    const opslagPad = `${klantId}/${bestandsnaam}`;

    const { error: uploadError } = await supabase.storage
      .from("klimaatapp")
      .upload(opslagPad, bestand);

    if (uploadError) {
      setMelding(uploadError.message);
      setUploaden(false);
      return;
    }

    const { error: dbError } = await supabase.from("bestanden").insert([
      {
        klant_id: klantId,
        bestandsnaam: bestand.name,
        opslag_pad: opslagPad,
        type: ext || null,
      },
    ]);

    if (dbError) {
      setMelding(dbError.message);
      setUploaden(false);
      return;
    }

    setBestand(null);
    setMelding("Bestand succesvol geüpload.");
    await loadBestanden(klantId);
    setUploaden(false);
  }

  function getPublicUrl(opslagPad: string) {
    const { data } = supabase.storage
      .from("klimaatapp")
      .getPublicUrl(opslagPad);

    return data.publicUrl;
  }

  return (
    <main className="p-8 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/klanten/${klantId}`} className="text-sm underline">
            ← Terug naar klant
          </Link>
          <h1 className="text-3xl font-bold mt-2">Bestanden</h1>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Bestand uploaden</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setBestand(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={uploaden}
            className="bg-black text-white rounded-lg px-4 py-3"
          >
            {uploaden ? "Uploaden..." : "Bestand uploaden"}
          </button>
        </form>

        {melding && <p className="mt-4 text-red-600">{melding}</p>}
      </section>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Geüploade bestanden</h2>

        {laden ? (
          <p>Bestanden laden...</p>
        ) : bestanden.length === 0 ? (
          <p>Nog geen bestanden geüpload.</p>
        ) : (
          <div className="grid gap-4">
            {bestanden.map((item) => (
              <a
                key={item.id}
                href={getPublicUrl(item.opslag_pad)}
                target="_blank"
                rel="noreferrer"
                className="border rounded-xl p-4 block hover:shadow"
              >
                <h3 className="font-semibold">{item.bestandsnaam}</h3>
                <p className="text-sm text-gray-600">
                  Type: {item.type || "onbekend"}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}