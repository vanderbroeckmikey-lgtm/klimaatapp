"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

export default function InstallatiesPage() {
  const supabase = createClient();

  const [installaties, setInstallaties] = useState<Installatie[]>([]);
  const [laden, setLaden] = useState(true);
  const [fout, setFout] = useState("");

  useEffect(() => {
    async function loadInstallaties() {
      const { data, error } = await supabase
        .from("installaties")
        .select(
          "id, naam, ruimte, merk, model, koudemiddel_type, status, installatienummer"
        )
        .order("created_at", { ascending: false });

      if (error) {
        setFout(error.message);
      } else {
        setInstallaties(data || []);
      }

      setLaden(false);
    }

    loadInstallaties();
  }, [supabase]);

  async function verwijderInstallatie(id: string) {
    const confirmDelete = confirm(
      "Weet je zeker dat je deze installatie wilt verwijderen?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("installaties")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Verwijderen mislukt: " + error.message);
    } else {
      setInstallaties((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Installaties</h1>
        <p className="mt-2 text-gray-600">
          Overzicht van alle installaties.
        </p>
      </div>

      {fout && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {fout}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {laden ? (
          <p>Installaties laden...</p>
        ) : installaties.length === 0 ? (
          <p>Nog geen installaties toegevoegd.</p>
        ) : (
          <div className="grid gap-4">
            {installaties.map((installatie) => (
              <div
                key={installatie.id}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h2 className="text-lg font-semibold">{installatie.naam}</h2>

                  <p className="text-sm text-gray-600">
                    Installatienummer: {installatie.installatienummer || "-"}
                  </p>

                  <p className="text-sm text-gray-600">
                    Ruimte: {installatie.ruimte || "-"}
                  </p>

                  <p className="text-sm text-gray-600">
                    Merk/model: {installatie.merk || "-"}{" "}
                    {installatie.model || ""}
                  </p>

                  <p className="text-sm text-gray-600">
                    Koudemiddel: {installatie.koudemiddel_type}
                  </p>

                  <p className="text-sm text-gray-600">
                    Status: {installatie.status}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/installaties/${installatie.id}`}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Bewerken
                  </Link>

                  <button
                    onClick={() => verwijderInstallatie(installatie.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}