"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function KlantBewerkenPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [plaats, setPlaats] = useState("");

  const [laden, setLaden] = useState(true);
  const [opslaanBezig, setOpslaanBezig] = useState(false);

  useEffect(() => {
    async function loadKlant() {
      const { data } = await supabase
        .from("klanten")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setNaam(data.naam || "");
        setEmail(data.email || "");
        setTelefoon(data.telefoon || "");
        setPlaats(data.plaats || "");
      }

      setLaden(false);
    }

    loadKlant();
  }, [id, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setOpslaanBezig(true);

    await supabase
      .from("klanten")
      .update({
        naam,
        email,
        telefoon,
        plaats,
      })
      .eq("id", id);

    setOpslaanBezig(false);

    router.push("/klanten");
    router.refresh();
  }

  if (laden) return <p>Klant laden...</p>;

  return (
    <main className="max-w-xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Klant wijzigen</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Naam</label>
          <input
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Telefoon</label>
          <input
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Plaats</label>
          <input
            value={plaats}
            onChange={(e) => setPlaats(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={opslaanBezig}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {opslaanBezig ? "Opslaan..." : "Opslaan"}
        </button>

      </form>
    </main>
  );
}