"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const koudemiddelen = [
  "R32",
  "R410A",
  "R407C",
  "R290",
  "R134a",
  "R404A",
  "R1234yf",
  "Anders",
];

export default function NieuweInstallatiePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [naam, setNaam] = useState("");
  const [ruimte, setRuimte] = useState("");
  const [projectnummer, setProjectnummer] = useState("");
  const [installatienummer, setInstallatienummer] = useState("");
  const [merk, setMerk] = useState("");
  const [model, setModel] = useState("");
  const [serienummerBinnen, setSerienummerBinnen] = useState("");
  const [serienummerBuiten, setSerienummerBuiten] = useState("");
  const [bouwjaar, setBouwjaar] = useState("");
  const [categorie, setCategorie] = useState("");
  const [koudemiddelType, setKoudemiddelType] = useState("R32");
  const [koudemiddelTypeAnders, setKoudemiddelTypeAnders] = useState("");
  const [koudemiddelInhoudKg, setKoudemiddelInhoudKg] = useState("");
  const [gwp, setGwp] = useState("");
  const [co2Equivalent, setCo2Equivalent] = useState("");
  const [mtwLaag, setMtwLaag] = useState("");
  const [mtwHoog, setMtwHoog] = useState("");
  const [pedCategorie, setPedCategorie] = useState("");
  const [status, setStatus] = useState("actief");
  const [opmerkingen, setOpmerkingen] = useState("");
  const [melding, setMelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaan(true);
    setMelding("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMelding("Je bent niet ingelogd.");
      setOpslaan(false);
      return;
    }

    const { id } = await params;

    const { error } = await supabase.from("installaties").insert([
      {
        klant_id: id,
        naam,
        ruimte: ruimte || null,
        projectnummer: projectnummer || null,
        installatienummer: installatienummer || null,
        merk: merk || null,
        model: model || null,
        serienummer_binnen: serienummerBinnen || null,
        serienummer_buiten: serienummerBuiten || null,
        bouwjaar: bouwjaar ? Number(bouwjaar) : null,
        categorie: categorie || null,
        koudemiddel_type: koudemiddelType,
        koudemiddel_type_anders:
          koudemiddelType === "Anders" ? koudemiddelTypeAnders || null : null,
        koudemiddel_inhoud_kg: koudemiddelInhoudKg
          ? Number(koudemiddelInhoudKg)
          : null,
        actuele_koudemiddel_inhoud_kg: koudemiddelInhoudKg
          ? Number(koudemiddelInhoudKg)
          : null,
        gwp: gwp ? Number(gwp) : null,
        co2_equivalent: co2Equivalent ? Number(co2Equivalent) : null,
        mtw_laag_bar: mtwLaag ? Number(mtwLaag) : null,
        mtw_hoog_bar: mtwHoog ? Number(mtwHoog) : null,
        ped_categorie: pedCategorie || null,
        status,
        opmerkingen: opmerkingen || null,
      },
    ]);

    setOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    window.location.href = `/klanten/${id}`;
  }

  return (
    <main className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nieuwe installatie</h1>
        <p className="mt-2 text-gray-600">
          Voeg een installatie toe aan deze klant.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Naam installatie</label>
            <input
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. Woonkamer split unit"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ruimte</label>
            <input
              value={ruimte}
              onChange={(e) => setRuimte(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. woonkamer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Projectnummer</label>
            <input
              value={projectnummer}
              onChange={(e) => setProjectnummer(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Installatienummer</label>
            <input
              value={installatienummer}
              onChange={(e) => setInstallatienummer(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Merk</label>
            <input
              value={merk}
              onChange={(e) => setMerk(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. Daikin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Serienummer binnenunit
            </label>
            <input
              value={serienummerBinnen}
              onChange={(e) => setSerienummerBinnen(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Serienummer buitenunit
            </label>
            <input
              value={serienummerBuiten}
              onChange={(e) => setSerienummerBuiten(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bouwjaar</label>
            <input
              type="number"
              value={bouwjaar}
              onChange={(e) => setBouwjaar(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categorie</label>
            <input
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bijv. split / multisplit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Koudemiddel</label>
            <select
              value={koudemiddelType}
              onChange={(e) => setKoudemiddelType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              {koudemiddelen.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {koudemiddelType === "Anders" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Ander koudemiddel
              </label>
              <input
                value={koudemiddelTypeAnders}
                onChange={(e) => setKoudemiddelTypeAnders(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Koudemiddelinhoud (kg)
            </label>
            <input
              type="number"
              step="0.001"
              value={koudemiddelInhoudKg}
              onChange={(e) => setKoudemiddelInhoudKg(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GWP</label>
            <input
              type="number"
              step="0.01"
              value={gwp}
              onChange={(e) => setGwp(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CO2 equivalent</label>
            <input
              type="number"
              step="0.001"
              value={co2Equivalent}
              onChange={(e) => setCo2Equivalent(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MTW laag (bar)</label>
            <input
              type="number"
              step="0.01"
              value={mtwLaag}
              onChange={(e) => setMtwLaag(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">MTW hoog (bar)</label>
            <input
              type="number"
              step="0.01"
              value={mtwHoog}
              onChange={(e) => setMtwHoog(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PED categorie</label>
            <input
              value={pedCategorie}
              onChange={(e) => setPedCategorie(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="actief">Actief</option>
              <option value="storing">Storing</option>
              <option value="onderhoud">Onderhoud</option>
              <option value="buiten_bedrijf">Buiten bedrijf</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Opmerkingen</label>
          <textarea
            value={opmerkingen}
            onChange={(e) => setOpmerkingen(e.target.value)}
            className="w-full min-h-32 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={opslaan}
          className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
        >
          {opslaan ? "Opslaan..." : "Installatie opslaan"}
        </button>

        {melding && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {melding}
          </p>
        )}
      </form>
    </main>
  );
}