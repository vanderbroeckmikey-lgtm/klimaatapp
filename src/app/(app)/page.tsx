"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DashboardStats = {
  klanten: number;
  opdrachten: number;
  bestanden: number;
  werkbonnen: number;
};

type Werkbon = {
  id: string;
  bonnummer: string | null;
  type: string;
  status: string;
  datum: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [stats, setStats] = useState<DashboardStats>({
    klanten: 0,
    opdrachten: 0,
    bestanden: 0,
    werkbonnen: 0,
  });

  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  const [laatsteWerkbonnen, setLaatsteWerkbonnen] = useState<Werkbon[]>([]);
  const [ladenWerkbonnen, setLadenWerkbonnen] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLaden(true);
      setFout("");

      try {
        const [
          klantenResult,
          opdrachtenResult,
          bestandenResult,
          werkbonnenResult,
        ] = await Promise.all([
          supabase.from("klanten").select("*", { count: "exact", head: true }),
          supabase.from("opdrachten").select("*", { count: "exact", head: true }),
          supabase.from("bestanden").select("*", { count: "exact", head: true }),
          supabase.from("werkbonnen").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          klanten: klantenResult.count ?? 0,
          opdrachten: opdrachtenResult.count ?? 0,
          bestanden: bestandenResult.count ?? 0,
          werkbonnen: werkbonnenResult.count ?? 0,
        });
      } catch (e: any) {
        setFout("Er ging iets mis bij het laden van het dashboard.");
      }

      setLaden(false);
    }

    async function loadLaatsteWerkbonnen() {
      setLadenWerkbonnen(true);
      try {
        const { data, error } = await supabase
          .from("werkbonnen")
          .select("id, bonnummer, type, status, datum")
          .order("datum", { ascending: false })
          .limit(5);

        if (!error && data) {
          setLaatsteWerkbonnen(data);
        }
      } catch (e) {
        console.error(e);
      }
      setLadenWerkbonnen(false);
    }

    loadStats();
    loadLaatsteWerkbonnen();
  }, [supabase]);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Interne bedrijfsapp
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welkom bij Klimaattechniek Benelux
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Beheer klanten, opdrachten, werkbonnen en documenten overzichtelijk op één plek.
          </p>
        </div>
      </section>

      {fout && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {fout}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Klanten</p>
          <h2 className="mt-2 text-3xl font-bold">{laden ? "..." : stats.klanten}</h2>
          <p className="mt-2 text-sm text-gray-600">Totaal aantal geregistreerde klanten</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Opdrachten</p>
          <h2 className="mt-2 text-3xl font-bold">{laden ? "..." : stats.opdrachten}</h2>
          <p className="mt-2 text-sm text-gray-600">Lopende werkzaamheden en installaties</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Werkbonnen</p>
          <h2 className="mt-2 text-3xl font-bold">{laden ? "..." : stats.werkbonnen}</h2>
          <p className="mt-2 text-sm text-gray-600">Totaal aantal werkbonnen</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Bestanden</p>
          <h2 className="mt-2 text-3xl font-bold">{laden ? "..." : stats.bestanden}</h2>
          <p className="mt-2 text-sm text-gray-600">Foto’s, werkbonnen en documenten</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Snelle acties</h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/klanten/nieuw"
              className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Nieuwe klant
            </Link>

            <Link
              href="/installaties/nieuw" 
              className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Nieuwe installatie
            </Link>

            <Link
              href="/werkbonnen/nieuw"
              className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Nieuwe werkbon
            </Link>

            <Link
              href="/werkbonnen/nieuw/inbedrijfstelling"
              className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Nieuwe inbedrijfstelling
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Laatste werkbonnen</h3>
          {ladenWerkbonnen ? (
            <p className="mt-2 text-gray-600">Laden...</p>
          ) : laatsteWerkbonnen.length === 0 ? (
            <p className="mt-2 text-gray-600">Nog geen werkbonnen aangemaakt.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {laatsteWerkbonnen.map((wb) => (
                <li key={wb.id} className="border-b border-gray-200 pb-1">
                  <div className="flex justify-between">
                    <span>{wb.bonnummer || "Onbekend"} - {wb.type}</span>
                    <span className="text-sm text-gray-500">{wb.status}</span>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(wb.datum).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}