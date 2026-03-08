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

type Installatie = {
  id: string;
  naam: string;
  ruimte: string | null;
  merk: string | null;
  model: string | null;
  koudemiddel_type: string;
  status: string;
  installatienummer: string | null;
};

export default function KlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [klant, setKlant] = useState<Klant | null>(null);
  const [opdrachten, setOpdrachten] = useState<Opdracht[]>([]);
  const [installaties, setInstallaties] = useState<Installatie[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    async function loadData() {
      const { id } = await params;

      const [klantResult, opdrachtenResult, installatiesResult] =
        await Promise.all([
          supabase.from("klanten").select("*").eq("id", id).single(),
          supabase
            .from("opdrachten")
            .select("id, titel, status, uitvoerdatum, omschrijving")
            .eq("klant_id", id)
            .order("created_at", { ascending: false }),
          supabase
            .from("installaties")
            .select(
              "id, naam, ruimte, merk, model, koudemiddel_type, status, installatienummer"
            )
            .eq("klant_id", id)
            .order("created_at", { ascending: false }),
        ]);

      if (klantResult.error) {
        setFout(klantResult.error.message);
      } else {
        setKlant(klantResult.data);
      }

      if (opdrachtenResult.error) {
        setFout(opdrachtenResult.error.message);
      } else {
        setOpdrachten(opdrachtenResult.data || []);
      }

      if (installatiesResult.error) {
        setFout(installatiesResult.error.message);
      } else {
        setInstallaties(installatiesResult.data || []);
      }

      setLaden(false);
    }

    loadData();
  }, [params, supabase]);

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
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/klanten" className="text-sm underline">
            ← Terug naar klanten
          </Link>
          <h1 className="text-3xl font-bold mt-2">{klant.naam}</h1>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/klanten/${klant.id}/installaties/nieuw`}
            className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
          >
            Nieuwe installatie
          </Link>

          <Link
            href={`/klanten/${klant.id}/werkbonnen/nieuw`}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 transition"
          >
            Nieuwe werkbon
          </Link>

          <Link
            href={`/klanten/${klant.id}/bestanden`}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 transition"
          >
            Bestanden
          </Link>

          <Link
            href={`/klanten/${klant.id}/opdrachten/nieuw`}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 transition"
          >
            Nieuwe opdracht
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Installaties</h2>
          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            {installaties.length} totaal
          </span>
        </div>

        {installaties.length === 0 ? (
          <p>Nog geen installaties toegevoegd.</p>
        ) : (
          <div className="grid gap-4">
            {installaties.map((installatie) => (
              <div
                key={installatie.id}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{installatie.naam}</h3>
                    <p className="text-sm text-gray-600">
                      Ruimte: {installatie.ruimte || "-"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Installatienummer: {installatie.installatienummer || "-"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {installatie.merk || "-"} {installatie.model || ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {installatie.koudemiddel_type}
                    </p>
                    <p className="text-sm text-gray-600">{installatie.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Opdrachten</h2>

        {opdrachten.length === 0 ? (
          <p>Nog geen opdrachten voor deze klant.</p>
        ) : (
          <div className="grid gap-4">
            {opdrachten.map((opdracht) => (
              <Link
                key={opdracht.id}
                href={`/opdrachten/${opdracht.id}`}
                className="rounded-xl border border-gray-200 p-4 block hover:shadow-md transition bg-white"
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