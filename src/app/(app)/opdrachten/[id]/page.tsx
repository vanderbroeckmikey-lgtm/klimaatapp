"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Opdracht = {
  id: string;
  klant_id: string;
  titel: string;
  status: string | null;
  uitvoerdatum: string | null;
  omschrijving: string | null;
};

type Bestand = {
  id: string;
  bestandsnaam: string;
  opslag_pad: string;
  type: string | null;
};

export default function OpdrachtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  
  const [opdracht, setOpdracht] = useState<Opdracht | null>(null);
  const [bestanden, setBestanden] = useState<Bestand[]>([]);
  const [bestand, setBestand] = useState<File | null>(null);
  const [laden, setLaden] = useState(true);
  const [uploaden, setUploaden] = useState(false);
  const [melding, setMelding] = useState("");

  async function loadData(opdrachtId: string) {
    const { data: opdrachtData, error: opdrachtError } = await supabase
      .from("opdrachten")
      .select("id, klant_id, titel, status, uitvoerdatum, omschrijving")
      .eq("id", opdrachtId)
      .single();

    if (opdrachtError) {
      setMelding(opdrachtError.message);
      setLaden(false);
      return;
    }

    setOpdracht(opdrachtData);

    const { data: bestandenData, error: bestandenError } = await supabase
      .from("bestanden")
      .select("id, bestandsnaam, opslag_pad, type")
      .eq("opdracht_id", opdrachtId)
      .order("created_at", { ascending: false });

    if (bestandenError) {
      setMelding(bestandenError.message);
    } else {
      setBestanden(bestandenData || []);
    }

    setLaden(false);
  }

  useEffect(() => {
    async function init() {
      const { id } = await params;
      await loadData(id);
    }

    init();
  }, [params]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMelding("");

    if (!bestand) {
      setMelding("Kies eerst een bestand.");
      return;
    }

    const { id } = await params;
    setUploaden(true);

    const ext = bestand.name.split(".").pop() || "";
    const uniekeNaam = `${Date.now()}-${bestand.name}`;
    const opslagPad = `opdrachten/${id}/${uniekeNaam}`;

    const { error: uploadError } = await supabase.storage
      .from("klant-bestanden")
      .upload(opslagPad, bestand);

    if (uploadError) {
      setMelding(uploadError.message);
      setUploaden(false);
      return;
    }

    const { error: dbError } = await supabase.from("bestanden").insert([
      {
        klant_id: opdracht?.klant_id || null,
        opdracht_id: id,
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
    await loadData(id);
    setUploaden(false);
  }

  function getPublicUrl(opslagPad: string) {
    const { data } = supabase.storage
      .from("klant-bestanden")
      .getPublicUrl(opslagPad);

    return data.publicUrl;
  }

  if (laden) {
    return (
      <main className="p-8">
        <p>Laden...</p>
      </main>
    );
  }

  if (!opdracht) {
    return (
      <main className="p-8">
        <p className="text-red-600">Opdracht niet gevonden.</p>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/klanten/${opdracht.klant_id}`}
            className="text-sm underline"
          >
            ← Terug naar klant
          </Link>
          <h1 className="text-3xl font-bold mt-2">{opdracht.titel}</h1>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Opdrachtgegevens</h2>

        <div className="space-y-2">
          <p><strong>Status:</strong> {opdracht.status || "-"}</p>
          <p><strong>Uitvoerdatum:</strong> {opdracht.uitvoerdatum || "-"}</p>
          <p><strong>Omschrijving:</strong> {opdracht.omschrijving || "-"}</p>
        </div>
      </section>

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
        <h2 className="text-xl font-semibold mb-4">Bestanden en foto's</h2>

        {bestanden.length === 0 ? (
          <p>Nog geen bestanden geüpload.</p>
        ) : (
          <div className="grid gap-4">
            {bestanden.map((item) => {
              const url = getPublicUrl(item.opslag_pad);
              const isAfbeelding =
                item.type === "jpg" ||
                item.type === "jpeg" ||
                item.type === "png" ||
                item.type === "webp";

              return (
                <div key={item.id} className="border rounded-xl p-4 bg-gray-50">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline"
                  >
                    {item.bestandsnaam}
                  </a>

                  <p className="text-sm text-gray-600 mt-1">
                    Type: {item.type || "onbekend"}
                  </p>

                  {isAfbeelding && (
                    <img
                      src={url}
                      alt={item.bestandsnaam}
                      className="mt-4 max-h-72 rounded-lg border"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}