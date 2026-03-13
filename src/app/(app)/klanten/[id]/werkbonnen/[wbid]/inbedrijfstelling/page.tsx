"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Werkbon = {
  id: string;
  klant_id: string;
  installatie_id: string | null;
  type: string;
  melding: string | null;
};

type Installatie = {
  id: string;
  projectnummer: string | null;
  installatienummer: string | null;
  naam: string;
  ruimte: string | null;
  koudemiddel_type: string;
  koudemiddel_inhoud_kg: number | null;
  gwp: number | null;
  co2_equivalent: number | null;
  categorie: string | null;
  mtw_laag_bar: number | null;
  mtw_hoog_bar: number | null;
  ped_categorie: string | null;
  bouwjaar: number | null;
};

type Inbedrijfstelling = {
  id?: string;
  opdrachtgever: string;
  werkadres: string;
  z_druk_bar: string;
  z_temp_c: string;
  p_druk_bar: string;
  p_temp_c: string;
  omgeving_temp_c: string;
  aanzuig_temp_c: string;
  uitblaas_temp_c: string;
  afpersdruk_bar: string;
  afpers_standtijd_min: string;
  vacuumdruk_pa: string;
  vacuum_standtijd_min: string;
  gebruikt_n2: boolean;
  installatie_lekdicht: boolean;
  lektester: string;
  logboek_ingevuld: boolean;
  kenplaat_aanwezig: boolean;
  hercontrole_24u: boolean;
  hercontrole_binnen_maand: boolean;
  werk_gereed: boolean;
  handtekening_monteur: string;
  handtekening_klant: string;
  opmerkingen_advies: string;
};

const leegFormulier: Inbedrijfstelling = {
  opdrachtgever: "",
  werkadres: "",
  z_druk_bar: "",
  z_temp_c: "",
  p_druk_bar: "",
  p_temp_c: "",
  omgeving_temp_c: "",
  aanzuig_temp_c: "",
  uitblaas_temp_c: "",
  afpersdruk_bar: "",
  afpers_standtijd_min: "",
  vacuumdruk_pa: "",
  vacuum_standtijd_min: "",
  gebruikt_n2: false,
  installatie_lekdicht: true,
  lektester: "",
  logboek_ingevuld: false,
  kenplaat_aanwezig: false,
  hercontrole_24u: false,
  hercontrole_binnen_maand: false,
  werk_gereed: false,
  handtekening_monteur: "",
  handtekening_klant: "",
  opmerkingen_advies: "",
};

export default function InbedrijfstellingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [werkbon, setWerkbon] = useState<Werkbon | null>(null);
  const [installatie, setInstallatie] = useState<Installatie | null>(null);
  const [formulier, setFormulier] = useState<Inbedrijfstelling>(leegFormulier);
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    async function loadData() {
      const { id } = await params;

      const { data: werkbonData, error: werkbonError } = await supabase
        .from("werkbonnen")
        .select("id, klant_id, installatie_id, type, melding")
        .eq("id", id)
        .single();

      if (werkbonError || !werkbonData) {
        setMelding(werkbonError?.message || "Werkbon niet gevonden.");
        setLaden(false);
        return;
      }

      setWerkbon(werkbonData);

      if (werkbonData.installatie_id) {
        const { data: installatieData } = await supabase
          .from("installaties")
          .select(`
            id,
            projectnummer,
            installatienummer,
            naam,
            ruimte,
            koudemiddel_type,
            koudemiddel_inhoud_kg,
            gwp,
            co2_equivalent,
            categorie,
            mtw_laag_bar,
            mtw_hoog_bar,
            ped_categorie,
            bouwjaar
          `)
          .eq("id", werkbonData.installatie_id)
          .single();

        if (installatieData) {
          setInstallatie(installatieData);
        }
      }

      const { data: bestaandRapport } = await supabase
        .from("inbedrijfstellingen")
        .select("*")
        .eq("werkbon_id", id)
        .maybeSingle();

      if (bestaandRapport) {
        setFormulier({
          opdrachtgever: bestaandRapport.opdrachtgever || "",
          werkadres: bestaandRapport.werkadres || "",
          z_druk_bar: bestaandRapport.z_druk_bar?.toString() || "",
          z_temp_c: bestaandRapport.z_temp_c?.toString() || "",
          p_druk_bar: bestaandRapport.p_druk_bar?.toString() || "",
          p_temp_c: bestaandRapport.p_temp_c?.toString() || "",
          omgeving_temp_c: bestaandRapport.omgeving_temp_c?.toString() || "",
          aanzuig_temp_c: bestaandRapport.aanzuig_temp_c?.toString() || "",
          uitblaas_temp_c: bestaandRapport.uitblaas_temp_c?.toString() || "",
          afpersdruk_bar: bestaandRapport.afpersdruk_bar?.toString() || "",
          afpers_standtijd_min: bestaandRapport.afpers_standtijd_min?.toString() || "",
          vacuumdruk_pa: bestaandRapport.vacuumdruk_pa?.toString() || "",
          vacuum_standtijd_min: bestaandRapport.vacuum_standtijd_min?.toString() || "",
          gebruikt_n2: !!bestaandRapport.gebruikt_n2,
          installatie_lekdicht: !!bestaandRapport.installatie_lekdicht,
          lektester: bestaandRapport.lektester || "",
          logboek_ingevuld: !!bestaandRapport.logboek_ingevuld,
          kenplaat_aanwezig: !!bestaandRapport.kenplaat_aanwezig,
          hercontrole_24u: !!bestaandRapport.hercontrole_24u,
          hercontrole_binnen_maand: !!bestaandRapport.hercontrole_binnen_maand,
          werk_gereed: !!bestaandRapport.werk_gereed,
          handtekening_monteur: bestaandRapport.handtekening_monteur || "",
          handtekening_klant: bestaandRapport.handtekening_klant || "",
          opmerkingen_advies: bestaandRapport.opmerkingen_advies || "",
        });
      }

      setLaden(false);
    }

    loadData();
  }, [params, supabase]);

  function setVeld<K extends keyof Inbedrijfstelling>(veld: K, waarde: Inbedrijfstelling[K]) {
    setFormulier((prev) => ({ ...prev, [veld]: waarde }));
  }

  async function handleOpslaan(e: React.FormEvent) {
    e.preventDefault();
    if (!werkbon || !werkbon.installatie_id) {
      setMelding("Koppel eerst een installatie aan deze werkbon.");
      return;
    }

    setOpslaan(true);
    setMelding("");

    const payload = {
      werkbon_id: werkbon.id,
      installatie_id: werkbon.installatie_id,
      opdrachtgever: formulier.opdrachtgever || null,
      werkadres: formulier.werkadres || null,
      z_druk_bar: formulier.z_druk_bar ? Number(formulier.z_druk_bar) : null,
      z_temp_c: formulier.z_temp_c ? Number(formulier.z_temp_c) : null,
      p_druk_bar: formulier.p_druk_bar ? Number(formulier.p_druk_bar) : null,
      p_temp_c: formulier.p_temp_c ? Number(formulier.p_temp_c) : null,
      omgeving_temp_c: formulier.omgeving_temp_c ? Number(formulier.omgeving_temp_c) : null,
      aanzuig_temp_c: formulier.aanzuig_temp_c ? Number(formulier.aanzuig_temp_c) : null,
      uitblaas_temp_c: formulier.uitblaas_temp_c ? Number(formulier.uitblaas_temp_c) : null,
      afpersdruk_bar: formulier.afpersdruk_bar ? Number(formulier.afpersdruk_bar) : null,
      afpers_standtijd_min: formulier.afpers_standtijd_min ? Number(formulier.afpers_standtijd_min) : null,
      vacuumdruk_pa: formulier.vacuumdruk_pa ? Number(formulier.vacuumdruk_pa) : null,
      vacuum_standtijd_min: formulier.vacuum_standtijd_min ? Number(formulier.vacuum_standtijd_min) : null,
      gebruikt_n2: formulier.gebruikt_n2,
      installatie_lekdicht: formulier.installatie_lekdicht,
      lektester: formulier.lektester || null,
      logboek_ingevuld: formulier.logboek_ingevuld,
      kenplaat_aanwezig: formulier.kenplaat_aanwezig,
      hercontrole_24u: formulier.hercontrole_24u,
      hercontrole_binnen_maand: formulier.hercontrole_binnen_maand,
      werk_gereed: formulier.werk_gereed,
      handtekening_monteur: formulier.handtekening_monteur || null,
      handtekening_klant: formulier.handtekening_klant || null,
      opmerkingen_advies: formulier.opmerkingen_advies || null,
    };

    const { data: bestaandRapport } = await supabase
      .from("inbedrijfstellingen")
      .select("id")
      .eq("werkbon_id", werkbon.id)
      .maybeSingle();

    let error = null;

    if (bestaandRapport?.id) {
      const result = await supabase
        .from("inbedrijfstellingen")
        .update(payload)
        .eq("id", bestaandRapport.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("inbedrijfstellingen")
        .insert([payload]);

      error = result.error;
    }

    setOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    setMelding("Inbedrijfstelrapport opgeslagen.");
  }

  if (laden) {
    return <main className="p-8">Rapport laden...</main>;
  }

  if (!werkbon) {
    return <main className="p-8 text-red-600">Werkbon niet gevonden.</main>;
  }

  return (
    <main className="max-w-5xl space-y-8">
      <div>
        <Link href={`/werkbonnen/${werkbon.id}`} className="text-sm underline">
          ← Terug naar werkbon
        </Link>
        <h1 className="text-3xl font-bold mt-2">Inbedrijfstelrapport</h1>
        <p className="mt-2 text-gray-600">
          Vul de meetwaarden en controles van de inbedrijfstelling in.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-xl font-semibold">Installatie-overzicht</h2>

        {!installatie ? (
          <p className="text-red-600">
            Geen installatie gekoppeld aan deze werkbon.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <p><strong>Projectnr:</strong> {installatie.projectnummer || "-"}</p>
            <p><strong>Inst. nr:</strong> {installatie.installatienummer || "-"}</p>
            <p><strong>Naam:</strong> {installatie.naam || "-"}</p>
            <p><strong>Ruimte:</strong> {installatie.ruimte || "-"}</p>
            <p><strong>Inhoud:</strong> {installatie.koudemiddel_inhoud_kg ?? "-"} kg {installatie.koudemiddel_type}</p>
            <p><strong>GWP / CO2:</strong> {installatie.gwp ?? "-"} / {installatie.co2_equivalent ?? "-"}</p>
            <p><strong>Categorie:</strong> {installatie.categorie || "-"}</p>
            <p><strong>MTW L/H:</strong> {installatie.mtw_laag_bar ?? "-"} / {installatie.mtw_hoog_bar ?? "-"} bar</p>
            <p><strong>PED-cat:</strong> {installatie.ped_categorie || "-"}</p>
            <p><strong>Bouwjaar:</strong> {installatie.bouwjaar || "-"}</p>
            <p><strong>Melding:</strong> {werkbon.melding || "-"}</p>
          </div>
        )}
      </section>

      <form
        onSubmit={handleOpslaan}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Opdrachtgever</label>
            <input
              value={formulier.opdrachtgever}
              onChange={(e) => setVeld("opdrachtgever", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Werkadres</label>
            <input
              value={formulier.werkadres}
              onChange={(e) => setVeld("werkadres", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-2">Z druk (bar)</label>
            <input value={formulier.z_druk_bar} onChange={(e) => setVeld("z_druk_bar", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Z temp (°C)</label>
            <input value={formulier.z_temp_c} onChange={(e) => setVeld("z_temp_c", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">P druk (bar)</label>
            <input value={formulier.p_druk_bar} onChange={(e) => setVeld("p_druk_bar", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">P temp (°C)</label>
            <input value={formulier.p_temp_c} onChange={(e) => setVeld("p_temp_c", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Omgeving temp (°C)</label>
            <input value={formulier.omgeving_temp_c} onChange={(e) => setVeld("omgeving_temp_c", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Aanzuigtemp (°C)</label>
            <input value={formulier.aanzuig_temp_c} onChange={(e) => setVeld("aanzuig_temp_c", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Uitblaastemp (°C)</label>
            <input value={formulier.uitblaas_temp_c} onChange={(e) => setVeld("uitblaas_temp_c", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-2">Afpersdruk (bar)</label>
            <input value={formulier.afpersdruk_bar} onChange={(e) => setVeld("afpersdruk_bar", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Standtijd afpersen (min)</label>
            <input value={formulier.afpers_standtijd_min} onChange={(e) => setVeld("afpers_standtijd_min", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Vacuümdruk (Pa)</label>
            <input value={formulier.vacuumdruk_pa} onChange={(e) => setVeld("vacuumdruk_pa", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Standtijd vacuüm (min)</label>
            <input value={formulier.vacuum_standtijd_min} onChange={(e) => setVeld("vacuum_standtijd_min", e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lektester</label>
          <input
            value={formulier.lektester}
            onChange={(e) => setVeld("lektester", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.gebruikt_n2} onChange={(e) => setVeld("gebruikt_n2", e.target.checked)} />
            <span>Gebruikt N2</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.installatie_lekdicht} onChange={(e) => setVeld("installatie_lekdicht", e.target.checked)} />
            <span>Installatie lekdicht</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.logboek_ingevuld} onChange={(e) => setVeld("logboek_ingevuld", e.target.checked)} />
            <span>Logboek ingevuld</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.kenplaat_aanwezig} onChange={(e) => setVeld("kenplaat_aanwezig", e.target.checked)} />
            <span>Kenplaat aanwezig</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.hercontrole_24u} onChange={(e) => setVeld("hercontrole_24u", e.target.checked)} />
            <span>24-uurs hercontrole uitgevoerd</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.hercontrole_binnen_maand} onChange={(e) => setVeld("hercontrole_binnen_maand", e.target.checked)} />
            <span>Hercontrole binnen maand nodig</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formulier.werk_gereed} onChange={(e) => setVeld("werk_gereed", e.target.checked)} />
            <span>Werk gereed</span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Naam / handtekening monteur</label>
            <input
              value={formulier.handtekening_monteur}
              onChange={(e) => setVeld("handtekening_monteur", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Naam / handtekening klant</label>
            <input
              value={formulier.handtekening_klant}
              onChange={(e) => setVeld("handtekening_klant", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Opmerkingen / advies</label>
          <textarea
            value={formulier.opmerkingen_advies}
            onChange={(e) => setVeld("opmerkingen_advies", e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={opslaan}
          className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
        >
          {opslaan ? "Opslaan..." : "Rapport opslaan"}
        </button>

        {melding && (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {melding}
          </p>
        )}
      </form>
    </main>
  );
}