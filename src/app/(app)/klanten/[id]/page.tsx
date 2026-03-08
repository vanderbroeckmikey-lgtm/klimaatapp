"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Klant = {
  id: string;
  naam: string;
  contactpersoon: string | null;
  email: string | null;
  telefoon: string | null;
  adres: string | null;
  postcode: string | null;
  plaats: string | null;
  opmerkingen: string | null;
};

type Opdracht = {
  id: string;
  titel: string;
  status: string | null;
  uitvoerdatum: string | null;
  omschrijving: string | null;
};

export default function KlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  
  const [klant, setKlant] = useState<Klant | null>(null);
  const [opdrachten, setOpdrachten] = useState<Opdracht[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    async function loadData() {
      const { id } = await params;

      const { data: klantData, error: klantError } = await supabase
        .from("klanten")
        .select("*")
        .eq("id", id)
        .single();

      const { data: opdrachtenData, error: opdrachtenError } = await supabase
        .from("opdrachten")
        .select("id, titel, status, uitvoerdatum, omschrijving")
        .eq("klant_id", id)
        .order("created_at", { ascending: false });

      if (klantError) {
        setFout(klantError.message);
      } else {
        setKlant(klantData);
      }

      if (opdrachtenError) {
        setFout(opdrachtenError.message);
      } else if (opdrachtenData) {
        setOpdrachten(opdrachtenData);
      }

      setLaden(false);
    }

    loadData();
  }, [params]);

  if (laden) {
    return (
      <main className="p-8">
        <p>Laden...</p>
      </main>
    );
  }

  if (fout || !klant) {
    return (
      <main className="p-8">
        <p className="text-red-600">{fout || "Klant niet gevonden."}</p>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/klanten" className="text-sm underline">
            ← Terug naar klanten
          </Link>
          <h1 className="text-3xl font-bold mt-2">{klant.naam}</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/klanten/${klant.id}/bestanden`}
            className="border rounded-lg px-4 py-2 bg-white"
          >
            Bestanden
          </Link>

          <Link
            href={`/klanten/${klant.id}/opdrachten/nieuw`}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Nieuwe opdracht
          </Link>
        </div>
      </div>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Klantgegevens</h2>

        <div className="space-y-2">
          <p><strong>Contactpersoon:</strong> {klant.contactpersoon || "-"}</p>
          <p><strong>E-mail:</strong> {klant.email || "-"}</p>
          <p><strong>Telefoon:</strong> {klant.telefoon || "-"}</p>
          <p><strong>Adres:</strong> {klant.adres || "-"}</p>
          <p><strong>Postcode:</strong> {klant.postcode || "-"}</p>
          <p><strong>Plaats:</strong> {klant.plaats || "-"}</p>
          <p><strong>Opmerkingen:</strong> {klant.opmerkingen || "-"}</p>
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Opdrachten</h2>

        {opdrachten.length === 0 ? (
          <p>Nog geen opdrachten voor deze klant.</p>
        ) : (
          <div className="grid gap-4">
            {opdrachten.map((opdracht) => (
              <Link
                key={opdracht.id}
                href={`/opdrachten/${opdracht.id}`}
                className="border rounded-xl p-4 block hover:shadow"
              >
                <h3 className="font-semibold text-lg">{opdracht.titel}</h3>
                <p><strong>Status:</strong> {opdracht.status || "-"}</p>
                <p><strong>Uitvoerdatum:</strong> {opdracht.uitvoerdatum || "-"}</p>
                <p><strong>Omschrijving:</strong> {opdracht.omschrijving || "-"}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}