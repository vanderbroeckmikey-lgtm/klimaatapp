"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InstallatieBewerkenPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [laden, setLaden] = useState(true);
  const [opslaanBezig, setOpslaanBezig] = useState(false);
  const [fout, setFout] = useState("");

  const [naam, setNaam] = useState("");
  const [ruimte, setRuimte] = useState("");
  const [merk, setMerk] = useState("");
  const [model, setModel] = useState("");
  const [koudemiddel, setKoudemiddel] = useState("");
  const [status, setStatus] = useState("");
  const [installatienummer, setInstallatienummer] = useState("");

  useEffect(() => {
    async function loadInstallatie() {
      const { data, error } = await supabase
        .from("installaties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setFout(error.message);
      } else if (data) {
        setNaam(data.naam || "");
        setRuimte(data.ruimte || "");
        setMerk(data.merk || "");
        setModel(data.model || "");
        setKoudemiddel(data.koudemiddel_type || "");
        setStatus(data.status || "");
        setInstallatienummer(data.installatienummer || "");
      }

      setLaden(false);
    }

    loadInstallatie();
  }, [id, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaanBezig(true);
    setFout("");

    const { error } = await supabase
      .from("installaties")
      .update({
        naam,
        ruimte,
        merk,
        model,
        koudemiddel_type: koudemiddel,
        status,
        installatienummer,
      })
      .eq("id", id);

    setOpslaanBezig(false);

    if (error) {
      setFout(error.message);
      return;
    }

    router.push("/installaties");
    router.refresh();
  }

  if (laden) {
    return <p>Installatie laden...</p>;
  }

  return (
    <main className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold">Installatie bewerken</h1>
        <p className="text-gray-600 mt-2">
          Pas de gegevens van de installatie aan.
        </p>
      </div>

      {fout && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {fout}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-medium">Naam</label>
          <input
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Installatienummer</label>
          <input
            value={installatienummer}
            onChange={(e) => setInstallatienummer(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Ruimte</label>
          <input
            value={ruimte}
            onChange={(e) => setRuimte(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Merk</label>
          <input
            value={merk}
            onChange={(e) => setMerk(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Model</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Koudemiddel</label>
          <input
            value={koudemiddel}
            onChange={(e) => setKoudemiddel(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={opslaanBezig}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          {opslaanBezig ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </form>
    </main>
  );
}