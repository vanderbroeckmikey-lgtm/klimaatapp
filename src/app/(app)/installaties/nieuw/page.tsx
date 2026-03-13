"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Klant = {
  id: string;
  naam: string;
};

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

export default function NieuweInstallatiePage() {
  const supabase = createClient();
  const router = useRouter();

  // Klantgegevens
  const [klanten, setKlanten] = useState<Klant[]>([]);
  const [klantKeuze, setKlantKeuze] = useState<"bestaand" | "nieuw">("bestaand");
  const [selectedKlantId, setSelectedKlantId] = useState("");
  const [naam, setNaam] = useState("");
  const [contactpersoon, setContactpersoon] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [adres, setAdres] = useState("");
  const [postcode, setPostcode] = useState("");
  const [plaats, setPlaats] = useState("");
  const [opmerkingen, setOpmerkingen] = useState("");

  // Installatiegegevens
  const [installatienaam, setInstallatienaam] = useState("");
  const [installatienummer, setInstallatienummer] = useState("");
  const [ruimte, setRuimte] = useState("");
  const [projectnummer, setProjectnummer] = useState("");
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

  const [melding, setMelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  // Klanten ophalen bij bestaande klant
  useEffect(() => {
    if (klantKeuze === "bestaand") {
      async function fetchKlanten() {
        const { data, error } = await supabase
          .from("klanten")
          .select("id, naam")
          .order("naam", { ascending: true });
        if (!error && data) setKlanten(data);
      }
      fetchKlanten();
    }
  }, [klantKeuze, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaan(true);
    setMelding("");

    if (klantKeuze === "bestaand" && !selectedKlantId) {
      setMelding("Selecteer eerst een klant.");
      setOpslaan(false);
      return;
    }

    let klantId = selectedKlantId;

    if (klantKeuze === "nieuw") {
      // Nieuwe klant aanmaken
      const { data: klantData, error: klantError } = await supabase
        .from("klanten")
        .insert([
          {
            naam,
            contactpersoon,
            email,
            telefoon,
            adres,
            postcode,
            plaats,
            opmerkingen,
          },
        ])
        .select("id")
        .single();

      if (klantError) {
        setMelding(klantError.message);
        setOpslaan(false);
        return;
      }

      klantId = klantData.id;
    }

    // Nieuwe installatie toevoegen
    const { error: installatieError } = await supabase.from("installaties").insert([
      {
        klant_id: klantId,
        naam: installatienaam,
        installatienummer: installatienummer || null,
        ruimte: ruimte || null,
        projectnummer: projectnummer || null,
        merk: merk || null,
        model: model || null,
        serienummer_binnen: serienummerBinnen || null,
        serienummer_buiten: serienummerBuiten || null,
        bouwjaar: bouwjaar ? Number(bouwjaar) : null,
        categorie: categorie || null,
        koudemiddel_type: koudemiddelType,
        koudemiddel_type_anders:
          koudemiddelType === "Anders" ? koudemiddelTypeAnders || null : null,
        koudemiddel_inhoud_kg: koudemiddelInhoudKg ? Number(koudemiddelInhoudKg) : null,
        actuele_koudemiddel_inhoud_kg: koudemiddelInhoudKg ? Number(koudemiddelInhoudKg) : null,
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

    if (installatieError) {
      setMelding(installatieError.message);
      return;
    }

    router.push(`/klanten/${klantId}`);
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold">
        Nieuwe installatie {klantKeuze === "nieuw" ? "voor nieuwe klant" : "voor klant"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Klant kiezen */}
        <div>
          <label className="block font-medium mb-1">Klant kiezen *</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="bestaand"
                checked={klantKeuze === "bestaand"}
                onChange={() => setKlantKeuze("bestaand")}
              />{" "}
              Bestaande klant
            </label>
            <label>
              <input
                type="radio"
                value="nieuw"
                checked={klantKeuze === "nieuw"}
                onChange={() => setKlantKeuze("nieuw")}
              />{" "}
              Nieuwe klant
            </label>
          </div>
        </div>

        {/* Selecteer bestaande klant */}
        {klantKeuze === "bestaand" && (
          <div>
            <label className="block font-medium mb-1">Selecteer klant *</label>
            <select
              required
              value={selectedKlantId}
              onChange={(e) => setSelectedKlantId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">-- Kies een klant --</option>
              {klanten.map((klant) => (
                <option key={klant.id} value={klant.id}>
                  {klant.naam}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nieuwe klant gegevens */}
        {klantKeuze === "nieuw" && (
          <div className="space-y-2">
            <input
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Naam klant *"
              required
              className="w-full border rounded-xl px-4 py-3"
            />
            <input
              value={contactpersoon}
              onChange={(e) => setContactpersoon(e.target.value)}
              placeholder="Contactpersoon"
              className="w-full border rounded-xl px-4 py-3"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full border rounded-xl px-4 py-3"
            />
            <input
              value={telefoon}
              onChange={(e) => setTelefoon(e.target.value)}
              placeholder="Telefoon"
              className="w-full border rounded-xl px-4 py-3"
            />
            <input
              value={adres}
              onChange={(e) => setAdres(e.target.value)}
              placeholder="Adres"
              className="w-full border rounded-xl px-4 py-3"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Postcode"
                className="w-full border rounded-xl px-4 py-3"
              />
              <input
                value={plaats}
                onChange={(e) => setPlaats(e.target.value)}
                placeholder="Plaats"
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <textarea
              value={opmerkingen}
              onChange={(e) => setOpmerkingen(e.target.value)}
              placeholder="Opmerkingen"
              className="w-full border rounded-xl px-4 py-3 min-h-32"
            />
          </div>
        )}

        {/* Installatie gegevens */}
        <input
          value={installatienaam}
          onChange={(e) => setInstallatienaam(e.target.value)}
          placeholder="Naam installatie *"
          required
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={installatienummer}
          onChange={(e) => setInstallatienummer(e.target.value)}
          placeholder="Installatienummer"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={ruimte}
          onChange={(e) => setRuimte(e.target.value)}
          placeholder="Ruimte"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={projectnummer}
          onChange={(e) => setProjectnummer(e.target.value)}
          placeholder="Projectnummer"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={merk}
          onChange={(e) => setMerk(e.target.value)}
          placeholder="Merk"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={serienummerBinnen}
          onChange={(e) => setSerienummerBinnen(e.target.value)}
          placeholder="Serienummer binnenunit"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={serienummerBuiten}
          onChange={(e) => setSerienummerBuiten(e.target.value)}
          placeholder="Serienummer buitenunit"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="number"
          value={bouwjaar}
          onChange={(e) => setBouwjaar(e.target.value)}
          placeholder="Bouwjaar"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          placeholder="Categorie"
          className="w-full border rounded-xl px-4 py-3"
        />
        <select
          value={koudemiddelType}
          onChange={(e) => setKoudemiddelType(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        >
          {koudemiddelen.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {koudemiddelType === "Anders" && (
          <input
            value={koudemiddelTypeAnders}
            onChange={(e) => setKoudemiddelTypeAnders(e.target.value)}
            placeholder="Ander koudemiddel"
            className="w-full border rounded-xl px-4 py-3"
          />
        )}
        <input
          type="number"
          step="0.001"
          value={koudemiddelInhoudKg}
          onChange={(e) => setKoudemiddelInhoudKg(e.target.value)}
          placeholder="Koudemiddelinhoud (kg)"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="number"
          step="0.01"
          value={gwp}
          onChange={(e) => setGwp(e.target.value)}
          placeholder="GWP"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="number"
          step="0.001"
          value={co2Equivalent}
          onChange={(e) => setCo2Equivalent(e.target.value)}
          placeholder="CO2 equivalent"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="number"
          step="0.01"
          value={mtwLaag}
          onChange={(e) => setMtwLaag(e.target.value)}
          placeholder="MTW laag (bar)"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          type="number"
          step="0.01"
          value={mtwHoog}
          onChange={(e) => setMtwHoog(e.target.value)}
          placeholder="MTW hoog (bar)"
          className="w-full border rounded-xl px-4 py-3"
        />
        <input
          value={pedCategorie}
          onChange={(e) => setPedCategorie(e.target.value)}
          placeholder="PED categorie"
          className="w-full border rounded-xl px-4 py-3"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-xl px-4 py-3"
        >
          <option value="actief">Actief</option>
          <option value="storing">Storing</option>
          <option value="onderhoud">Onderhoud</option>
          <option value="buiten_bedrijf">Buiten bedrijf</option>
        </select>

        {melding && <p className="text-red-600">{melding}</p>}

        <button
          type="submit"
          disabled={opslaan}
          className="bg-red-600 text-white rounded-xl px-4 py-3 hover:bg-red-700 transition"
        >
          {opslaan ? "Opslaan..." : "Opslaan"}
        </button>
      </form>
    </main>
  );
}