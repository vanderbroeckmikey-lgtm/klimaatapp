"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Installatie = {
  id: string;
  naam: string;
  installatienummer: string | null;
};

type Klant = {
  id: string;
  naam: string;
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
  params: { id: string };
}) {
  const supabase = createClient();

  const [klantId, setKlantId] = useState("");
  const [klanten, setKlanten] = useState<Klant[]>([]);
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
      const klantIdFromUrl = params.id;

      setKlantId(klantIdFromUrl);

      // klanten ophalen
      const { data: klantenData } = await supabase
        .from("klanten")
        .select("id, naam")
        .order("naam");

      setKlanten(klantenData || []);

      // installaties ophalen
      const { data, error } = await supabase
        .from("installaties")
        .select("id, naam, installatienummer")
        .eq("klant_id", klantIdFromUrl)
        .order("created_at", { ascending: false });

      if (error) {
        setFoutmelding(error.message);
      } else {
        setInstallaties(data || []);
      }
    }

    init();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!klantId) {
      setFoutmelding("Selecteer een klant.");
      return;
    }

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
      <h1 className="text-3xl font-bold">Nieuwe werkbon</h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-6 space-y-6"
      >
        {/* KLANT */}
        <div>
          <label className="block text-sm font-medium mb-2">Klant</label>

          <select
            value={klantId}
            onChange={(e) => setKlantId(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="">Selecteer klant</option>

            {klanten.map((klant) => (
              <option key={klant.id} value={klant.id}>
                {klant.naam}
              </option>
            ))}
          </select>
        </div>

        {/* BASIS */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Bonnummer"
            value={bonnummer}
            onChange={(e) => setBonnummer(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Monteur"
            value={monteur}
            onChange={(e) => setMonteur(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* INSTALLATIE */}
        <div>
          <label className="block text-sm mb-2">Installatie</label>

          <select
            value={installatieId}
            onChange={(e) => setInstallatieId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Geen installatie</option>

            {installaties.map((i) => (
              <option key={i.id} value={i.id}>
                {i.naam}
                {i.installatienummer
                  ? ` (${i.installatienummer})`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {/* OMSCHRIJVING */}
        <textarea
          placeholder="Melding"
          value={melding}
          onChange={(e) => setMelding(e.target.value)}
          className="border rounded-xl px-4 py-3"
        />

        <textarea
          placeholder="Werkzaamheden"
          value={werkzaamheden}
          onChange={(e) => setWerkzaamheden(e.target.value)}
          className="border rounded-xl px-4 py-3"
        />

        <textarea
          placeholder="Gebruikte materialen"
          value={gebruikteMaterialen}
          onChange={(e) =>
            setGebruikteMaterialen(e.target.value)
          }
          className="border rounded-xl px-4 py-3"
        />

        {/* UREN */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.25"
            placeholder="Werkuren"
            value={werkuren}
            onChange={(e) => setWerkuren(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />

          <input
            type="number"
            step="0.25"
            placeholder="Reistijd"
            value={reistijd}
            onChange={(e) => setReistijd(e.target.value)}
            className="border rounded-xl px-4 py-3"
          />
        </div>

        <textarea
          placeholder="Opmerkingen"
          value={opmerkingen}
          onChange={(e) => setOpmerkingen(e.target.value)}
          className="border rounded-xl px-4 py-3"
        />

        <button
          type="submit"
          disabled={opslaan}
          className="bg-red-600 text-white px-6 py-3 rounded-xl"
        >
          {opslaan ? "Opslaan..." : "Werkbon opslaan"}
        </button>

        {foutmelding && (
          <p className="text-red-600">{foutmelding}</p>
        )}
      </form>
    </main>
  );
}