"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Cilinder = {
  id: string;
  cilinder_code: string | null;
  koudemiddel_type: string;
  startgewicht_kg: number;
  huidig_gewicht_kg: number;
  leeggewicht_kg: number | null;
  status: string;
};

export default function KoudemiddelPage() {
  const supabase = createClient();

  const [cilinders, setCilinders] = useState<Cilinder[]>([]);
  const [laden, setLaden] = useState(true);

  async function load() {
    setLaden(true);

    const { data, error } = await supabase
      .from("cilinder_voorraad")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCilinders(data);
    }

    setLaden(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function verwijderCilinder(id: string) {
    const bevestiging = confirm(
      "Weet je zeker dat je deze cilinder wilt verwijderen?"
    );

    if (!bevestiging) return;

    const { error } = await supabase
      .from("koudemiddel_cilinders")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Verwijderen mislukt");
      return;
    }

    load();
  }

  async function voegMutatieToe(cilinderId: string) {
    const kgInput = prompt(
      "Aantal kg\nGebruik - voor verbruik\nGebruik + voor vullen of correctie"
    );

    if (!kgInput) return;

    const kg = Number(kgInput);

    if (isNaN(kg)) {
      alert("Ongeldig getal");
      return;
    }

    const type = kg < 0 ? "verbruikt" : "gevuld";

    const opmerking = prompt("Opmerking (optioneel)") || "";

    const { error } = await supabase
      .from("koudemiddel_mutaties")
      .insert({
        cilinder_id: cilinderId,
        type: type,
        hoeveelheid_kg: kg,
        opmerking: opmerking,
      });

    if (error) {
      alert("Mutatie opslaan mislukt");
      return;
    }

    load();
  }

  return (
    <main className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Koudemiddelvoorraad</h1>
          <p className="text-gray-600">
            Overzicht van alle cilinders en voorraad
          </p>
        </div>

        <Link
          href="/koudemiddel/nieuw"
          className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700"
        >
          Nieuwe cilinder
        </Link>
      </div>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">

        {laden ? (
          <p>Laden...</p>
        ) : cilinders.length === 0 ? (
          <p>Nog geen cilinders toegevoegd.</p>
        ) : (
          <div className="grid gap-4">

            {cilinders.map((cilinder) => (

              <div
                key={cilinder.id}
                className="border rounded-xl p-4 bg-gray-50"
              >

                <div className="flex justify-between items-start">

                  <Link
                    href={`/koudemiddel/${cilinder.id}`}
                    className="flex-1"
                  >
                    <h3 className="font-semibold text-lg">
                      {cilinder.koudemiddel_type}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Cilinder: {cilinder.cilinder_code || "-"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Startgewicht: {cilinder.startgewicht_kg} kg
                    </p>

                    {cilinder.leeggewicht_kg && (
                      <p className="text-sm text-gray-600">
                        Leeggewicht: {cilinder.leeggewicht_kg} kg
                      </p>
                    )}
                  </Link>

                  <div className="text-right">

                    <p className="font-semibold text-lg">
                      {Number(cilinder.huidig_gewicht_kg).toFixed(2)} kg
                    </p>

                    <p className="text-sm text-gray-600">
                      Status: {cilinder.status}
                    </p>

                    <div className="flex gap-2 mt-3 justify-end">

                      <button
                        onClick={() => voegMutatieToe(cilinder.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Mutatie
                      </button>

                      <button
                        onClick={() => verwijderCilinder(cilinder.id)}
                        className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        Verwijderen
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}