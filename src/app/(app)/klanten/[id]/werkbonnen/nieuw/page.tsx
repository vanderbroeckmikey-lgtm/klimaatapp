"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Installatie = {
  id: string;
  naam: string;
  installatienummer: string | null;
};

const types = [
  "storing",
  "onderhoud",
  "inbedrijfstelling",
  "modificatie",
];

const statuses = ["concept", "open", "afgerond", "gefactureerd"];

export default function NieuweWerkbonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [klantId, setKlantId] = useState("");
  const [installaties, setInstallaties] = useState<Installatie[]>([]);
  const [bonnummer, setBonnummer] = useState("");
  const [type, setType] = useState("storing");
  const [status, setStatus] = useState("concept");
  const [datum, setDatum] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [monteur, setMonteur] = useState("");
  const [installatieId, setInstallatieId] = useState("");
  const [melding, setMelding] = useState("");
  const [werkzaamheden, setWerkzaamheden] = useState("");
  const [gebruikteMaterialen, setGebruikteMaterialen] = useState("");
  const [werkuren, setWerkuren] = useState("");
  const [reistijd, setReistijd] = useState("");
  const [opmerkingen, setOpmerkingen] = useState("");
  const [foutmelding, setFoutmelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  useEffect(() => {
    async function init() {
      const { id } = await params;
      setKlantId(id);

      const { data, error } = await supabase
        .from("installaties")
        .select("id, naam, installatienummer")
        .eq("klant_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        setFoutmelding(error.message);
      } else {
        setInstallaties(data || []);
      }
    }

    init();
  }, [params, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaan(true);
    setFoutmelding("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFoutmelding("Je bent niet ingelogd.");
      setOpslaan(false);
      return;
    }

    const { error } = await supabase.from("werkbonnen").insert([
      {
        klant_id: klantId,
        installatie_id: installatieId || null,
        bonnummer: bonnummer || null,
        type,
        status,
        datum,
        monteur: monteur || null,
        melding: melding || null,
        werkzaamheden: werkzaamheden || null,
        gebruikte_materialen: gebruikteMaterialen || null,
        werkuren: werkuren ? Number(werkuren) : null,
        reistijd: reistijd ? Number(reistijd) : null,
        opmerkingen: opmerkingen || null,
      },
    ]);

    setOpslaan(false);

    if (error) {
      setFoutmelding(error.message);
      return;
    }

    window.location.href = `/klanten/${klantId}`;
  }

  return (
    <main className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nieuwe werkbon</h1>
        <p className="mt-2 text-gray-600">
          Maak een storingsbon, onderhoudsbon of inbedrijfstelling aan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Bonnummer</label>
            <input
              value={bonnummer}
              onChange={(e) => setBonnummer(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. WB-2026-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Datum</label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Monteur</label>
            <input
              value={monteur}
              onChange={(e) => setMonteur(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Naam monteur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Installatie</label>
            <select
              value={installatieId}
              onChange={(e) => setInstallatieId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="">Geen installatie gekozen</option>
              {installaties.map((installatie) => (
                <option key={installatie.id} value={installatie.id}>
                  {installatie.naam}
                  {installatie.installatienummer
                    ? ` (${installatie.installatienummer})`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Melding</label>
          <textarea
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
            placeholder="Bijv. binnenunit koelt niet goed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Werkzaamheden</label>
          <textarea
            value={werkzaamheden}
            onChange={(e) => setWerkzaamheden(e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Gebruikte materialen
          </label>
          <textarea
            value={gebruikteMaterialen}
            onChange={(e) => setGebruikteMaterialen(e.target.value)}
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Werkuren</label>
            <input
              type="number"
              step="0.25"
              value={werkuren}
              onChange={(e) => setWerkuren(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reistijd</label>
            <input
              type="number"
              step="0.25"
              value={reistijd}
              onChange={(e) => setReistijd(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Opmerkingen</label>
          <textarea
            value={opmerkingen}
            onChange={(e) => setOpmerkingen(e.target.value)}
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={opslaan}
          className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
        >
          {opslaan ? "Opslaan..." : "Werkbon opslaan"}
        </button>

        {foutmelding && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {foutmelding}
          </p>
        )}
      </form>
    </main>
  );
}