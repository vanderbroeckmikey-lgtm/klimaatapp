"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Werkbon = {
  id: string;
  bonnummer: string | null;
  type: string;
  status: string;
  datum: string;
  monteur: string | null;
  melding: string | null;
  werkzaamheden: string | null;
  gebruikte_materialen: string | null;
  werkuren: number | null;
  reistijd: number | null;
  opmerkingen: string | null;
  klant_id: string;
  installatie_id: string | null;
};

type Cilinder = {
  id: string;
  cilinder_code: string | null;
  koudemiddel_type: string;
  huidig_gewicht_kg: number;
  status: string;
};

type Mutatie = {
  id: string;
  koudemiddel_type: string;
  type_mutatie: string;
  hoeveelheid_kg: number;
  opmerking: string | null;
  created_at: string;
};

export default function WerkbonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [werkbon, setWerkbon] = useState<Werkbon | null>(null);
  const [cilinders, setCilinders] = useState<Cilinder[]>([]);
  const [mutaties, setMutaties] = useState<Mutatie[]>([]);
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [melding, setMelding] = useState("");

  const [cilinderId, setCilinderId] = useState("");
  const [koudemiddelType, setKoudemiddelType] = useState("R32");
  const [typeMutatie, setTypeMutatie] = useState("bijgevuld");
  const [hoeveelheidKg, setHoeveelheidKg] = useState("");
  const [mutatieOpmerking, setMutatieOpmerking] = useState("");
  const [mutatieOpslaan, setMutatieOpslaan] = useState(false);

  useEffect(() => {
    async function loadWerkbon() {
      const { id } = await params;

      const { data, error } = await supabase
        .from("werkbonnen")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setMelding(error.message);
        setLaden(false);
        return;
      }

      setWerkbon(data);

      const { data: cilindersData } = await supabase
        .from("koudemiddel_cilinders")
        .select("id, cilinder_code, koudemiddel_type, huidig_gewicht_kg, status")
        .order("created_at", { ascending: false });

      setCilinders(cilindersData || []);

      const { data: mutatiesData } = await supabase
        .from("koudemiddel_mutaties")
        .select("id, koudemiddel_type, type_mutatie, hoeveelheid_kg, opmerking, created_at")
        .eq("werkbon_id", id)
        .order("created_at", { ascending: false });

      setMutaties(mutatiesData || []);
      setLaden(false);
    }

    loadWerkbon();
  }, [params, supabase]);

  async function handleOpslaan() {
    if (!werkbon) return;

    setOpslaan(true);

    const { error } = await supabase
      .from("werkbonnen")
      .update({
        bonnummer: werkbon.bonnummer,
        type: werkbon.type,
        status: werkbon.status,
        datum: werkbon.datum,
        monteur: werkbon.monteur,
        melding: werkbon.melding,
        werkzaamheden: werkbon.werkzaamheden,
        gebruikte_materialen: werkbon.gebruikte_materialen,
        werkuren: werkbon.werkuren,
        reistijd: werkbon.reistijd,
        opmerkingen: werkbon.opmerkingen,
      })
      .eq("id", werkbon.id);

    setOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    setMelding("Werkbon opgeslagen.");
  }

  async function handleMutatieOpslaan() {
    if (!werkbon) return;

    setMelding("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMelding("Je bent niet ingelogd.");
      return;
    }

    if (!cilinderId) {
      setMelding("Kies eerst een cilinder.");
      return;
    }

    if (!hoeveelheidKg || Number(hoeveelheidKg) <= 0) {
      setMelding("Vul een geldige hoeveelheid in.");
      return;
    }

    setMutatieOpslaan(true);

    const gekozenCilinder = cilinders.find((c) => c.id === cilinderId);

    const { error } = await supabase.from("koudemiddel_mutaties").insert([
      {
        cilinder_id: cilinderId,
        klant_id: werkbon.klant_id,
        installatie_id: werkbon.installatie_id,
        werkbon_id: werkbon.id,
        koudemiddel_type: gekozenCilinder?.koudemiddel_type || koudemiddelType,
        type_mutatie: typeMutatie,
        hoeveelheid_kg: Number(hoeveelheidKg),
        opmerking: mutatieOpmerking || null,
      },
    ]);

    setMutatieOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    const { data: cilindersData } = await supabase
      .from("koudemiddel_cilinders")
      .select("id, cilinder_code, koudemiddel_type, huidig_gewicht_kg, status")
      .order("created_at", { ascending: false });

    setCilinders(cilindersData || []);

    const { data: mutatiesData } = await supabase
      .from("koudemiddel_mutaties")
      .select("id, koudemiddel_type, type_mutatie, hoeveelheid_kg, opmerking, created_at")
      .eq("werkbon_id", werkbon.id)
      .order("created_at", { ascending: false });

    setMutaties(mutatiesData || []);

    setCilinderId("");
    setHoeveelheidKg("");
    setMutatieOpmerking("");
    setMelding("Koudemiddelmutatie opgeslagen.");
  }

  if (laden) {
    return (
      <main className="p-8">
        <p>Werkbon laden...</p>
      </main>
    );
  }

  if (!werkbon) {
    return (
      <main className="p-8">
        <p className="text-red-600">Werkbon niet gevonden.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl space-y-8">
      <div>
        <Link href="/werkbonnen" className="text-sm underline">
          ← Terug naar werkbonnen
        </Link>

        <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
          <h1 className="text-3xl font-bold">
            Werkbon {werkbon.bonnummer || ""}
          </h1>

          {werkbon.type === "inbedrijfstelling" && (
            <Link
              href={`/werkbonnen/${werkbon.id}/inbedrijfstelling`}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 transition"
            >
              Inbedrijfstelrapport
            </Link>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Bonnummer</label>
            <input
              value={werkbon.bonnummer || ""}
              onChange={(e) =>
                setWerkbon({ ...werkbon, bonnummer: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Datum</label>
            <input
              type="date"
              value={werkbon.datum}
              onChange={(e) =>
                setWerkbon({ ...werkbon, datum: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={werkbon.type}
              onChange={(e) =>
                setWerkbon({ ...werkbon, type: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="storing">storing</option>
              <option value="onderhoud">onderhoud</option>
              <option value="inbedrijfstelling">inbedrijfstelling</option>
              <option value="modificatie">modificatie</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={werkbon.status}
              onChange={(e) =>
                setWerkbon({ ...werkbon, status: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="concept">concept</option>
              <option value="open">open</option>
              <option value="afgerond">afgerond</option>
              <option value="gefactureerd">gefactureerd</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Monteur</label>
            <input
              value={werkbon.monteur || ""}
              onChange={(e) =>
                setWerkbon({ ...werkbon, monteur: e.target.value })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Werkuren</label>
            <input
              type="number"
              step="0.25"
              value={werkbon.werkuren || ""}
              onChange={(e) =>
                setWerkbon({
                  ...werkbon,
                  werkuren: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Melding</label>
          <textarea
            value={werkbon.melding || ""}
            onChange={(e) =>
              setWerkbon({ ...werkbon, melding: e.target.value })
            }
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Werkzaamheden</label>
          <textarea
            value={werkbon.werkzaamheden || ""}
            onChange={(e) =>
              setWerkbon({
                ...werkbon,
                werkzaamheden: e.target.value,
              })
            }
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Gebruikte materialen
          </label>
          <textarea
            value={werkbon.gebruikte_materialen || ""}
            onChange={(e) =>
              setWerkbon({
                ...werkbon,
                gebruikte_materialen: e.target.value,
              })
            }
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Opmerkingen</label>
          <textarea
            value={werkbon.opmerkingen || ""}
            onChange={(e) =>
              setWerkbon({
                ...werkbon,
                opmerkingen: e.target.value,
              })
            }
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          onClick={handleOpslaan}
          disabled={opslaan}
          className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
        >
          {opslaan ? "Opslaan..." : "Werkbon opslaan"}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Koudemiddelregistratie</h2>
          <p className="text-sm text-gray-600 mt-1">
            Registreer hier bijvullen, aftappen of correcties vanuit deze werkbon.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Cilinder</label>
            <select
              value={cilinderId}
              onChange={(e) => {
                const id = e.target.value;
                setCilinderId(id);
                const gekozen = cilinders.find((c) => c.id === id);
                if (gekozen) setKoudemiddelType(gekozen.koudemiddel_type);
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="">Kies een cilinder</option>
              {cilinders.map((cilinder) => (
                <option key={cilinder.id} value={cilinder.id}>
                  {cilinder.koudemiddel_type} - {cilinder.cilinder_code || "zonder code"} - {cilinder.huidig_gewicht_kg} kg
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type mutatie</label>
            <select
              value={typeMutatie}
              onChange={(e) => setTypeMutatie(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="bijgevuld">bijgevuld</option>
              <option value="afgetapt">afgetapt</option>
              <option value="correctie">correctie</option>
              <option value="retour">retour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Koudemiddel</label>
            <input
              value={koudemiddelType}
              onChange={(e) => setKoudemiddelType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hoeveelheid (kg)</label>
            <input
              type="number"
              step="0.001"
              value={hoeveelheidKg}
              onChange={(e) => setHoeveelheidKg(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. 1.250"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Opmerking</label>
          <textarea
            value={mutatieOpmerking}
            onChange={(e) => setMutatieOpmerking(e.target.value)}
            className="w-full min-h-24 rounded-xl border border-gray-300 px-4 py-3"
            placeholder="Bijv. bijgevuld na lekdetectie"
          />
        </div>

        <button
          onClick={handleMutatieOpslaan}
          disabled={mutatieOpslaan}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 transition"
        >
          {mutatieOpslaan ? "Opslaan..." : "Koudemiddelmutatie opslaan"}
        </button>

        {melding && (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {melding}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Mutatiehistorie</h2>

        {mutaties.length === 0 ? (
          <p>Nog geen koudemiddelmutaties geregistreerd.</p>
        ) : (
          <div className="grid gap-4">
            {mutaties.map((mutatie) => (
              <div
                key={mutatie.id}
                className="rounded-xl border border-gray-200 p-4 bg-gray-50"
              >
                <p><strong>Type:</strong> {mutatie.type_mutatie}</p>
                <p><strong>Koudemiddel:</strong> {mutatie.koudemiddel_type}</p>
                <p><strong>Hoeveelheid:</strong> {mutatie.hoeveelheid_kg} kg</p>
                <p><strong>Opmerking:</strong> {mutatie.opmerking || "-"}</p>
                <p><strong>Datum:</strong> {new Date(mutatie.created_at).toLocaleString("nl-NL")}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}