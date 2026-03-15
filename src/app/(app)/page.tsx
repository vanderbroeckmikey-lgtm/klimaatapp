"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DashboardStats = {
  klanten: number;
  installaties: number;
  werkbonnen: number;
  bestanden: number;
};

type Werkbon = {
  id: string;
  bonnummer: string | null;
  type: string;
  status: string;
  datum: string;
};

type Klant = {
  id: string;
  naam: string;
};

type Installatie = {
  id: string;
  naam: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [stats, setStats] = useState<DashboardStats>({
    klanten: 0,
    installaties: 0,
    werkbonnen: 0,
    bestanden: 0,
  });

  const [laatsteWerkbonnen, setLaatsteWerkbonnen] = useState<Werkbon[]>([]);
  const [laatsteKlanten, setLaatsteKlanten] = useState<Klant[]>([]);
  const [laatsteInstallaties, setLaatsteInstallaties] = useState<Installatie[]>([]);

  const [laden, setLaden] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLaden(true);

      const [
        klantenCount,
        installatiesCount,
        werkbonnenCount,
        bestandenCount,
      ] = await Promise.all([
        supabase.from("klanten").select("*", { count: "exact", head: true }),
        supabase.from("installaties").select("*", { count: "exact", head: true }),
        supabase.from("werkbonnen").select("*", { count: "exact", head: true }),
        supabase.from("bestanden").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        klanten: klantenCount.count ?? 0,
        installaties: installatiesCount.count ?? 0,
        werkbonnen: werkbonnenCount.count ?? 0,
        bestanden: bestandenCount.count ?? 0,
      });

      const { data: wb } = await supabase
        .from("werkbonnen")
        .select("id, bonnummer, type, status, datum")
        .order("datum", { ascending: false })
        .limit(5);

      const { data: klanten } = await supabase
        .from("klanten")
        .select("id, naam")
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: installaties } = await supabase
        .from("installaties")
        .select("id, naam")
        .order("created_at", { ascending: false })
        .limit(5);

      setLaatsteWerkbonnen(wb || []);
      setLaatsteKlanten(klanten || []);
      setLaatsteInstallaties(installaties || []);

      setLaden(false);
    }

    loadDashboard();
  }, [supabase]);

  return (
    <main className="space-y-8">

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overzicht van klanten, installaties en werkbonnen.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Klanten</p>
          <h2 className="text-3xl font-bold">{laden ? "..." : stats.klanten}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Installaties</p>
          <h2 className="text-3xl font-bold">{laden ? "..." : stats.installaties}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Werkbonnen</p>
          <h2 className="text-3xl font-bold">{laden ? "..." : stats.werkbonnen}</h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-gray-500">Bestanden</p>
          <h2 className="text-3xl font-bold">{laden ? "..." : stats.bestanden}</h2>
        </div>

      </section>

      <section className="grid gap-4 lg:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-xl font-semibold mb-4">Recente klanten</h3>

          <ul className="space-y-2">
            {laatsteKlanten.map((klant) => (
              <li key={klant.id} className="flex justify-between">
                <span>{klant.naam}</span>
                <Link
                  href={`/klanten/${klant.id}`}
                  className="text-sm text-blue-600"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>

        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-xl font-semibold mb-4">Recente installaties</h3>

          <ul className="space-y-2">
            {laatsteInstallaties.map((inst) => (
              <li key={inst.id} className="flex justify-between">
                <span>{inst.naam}</span>
                <Link
                  href={`/installaties/${inst.id}`}
                  className="text-sm text-blue-600"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>

        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-xl font-semibold mb-4">Laatste werkbonnen</h3>

          <ul className="space-y-2">
            {laatsteWerkbonnen.map((wb) => (
              <li key={wb.id} className="flex justify-between">

                <div>
                  <div className="font-medium">
                    {wb.bonnummer || "Onbekend"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(wb.datum).toLocaleDateString()}
                  </div>
                </div>

                <Link
                  href={`/werkbonnen/${wb.id}`}
                  className="text-sm text-blue-600"
                >
                  Open
                </Link>

              </li>
            ))}
          </ul>

        </div>

      </section>

      <section className="rounded-2xl border bg-white p-6">

        <h3 className="text-xl font-semibold mb-4">Snelle acties</h3>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/klanten/nieuw"
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Nieuwe klant
          </Link>

          <Link
            href="/installaties/nieuw"
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Nieuwe installatie
          </Link>

          <Link
            href="/werkbonnen/nieuw"
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Nieuwe werkbon
          </Link>

        </div>

      </section>

    </main>
  );
}