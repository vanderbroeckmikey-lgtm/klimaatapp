"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NieuweKlantPage() {
  const supabase = createClient();
  
  const [naam, setNaam] = useState("");
  const [contactpersoon, setContactpersoon] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [adres, setAdres] = useState("");
  const [postcode, setPostcode] = useState("");
  const [plaats, setPlaats] = useState("");
  const [opmerkingen, setOpmerkingen] = useState("");
  const [melding, setMelding] = useState("");
  const [opslaan, setOpslaan] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpslaan(true);
    setMelding("");

    const { error } = await supabase.from("klanten").insert([
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
    ]);

    setOpslaan(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    window.location.href = "/klanten";
  }

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Nieuwe klant</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Bedrijfsnaam of klantnaam"
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          value={contactpersoon}
          onChange={(e) => setContactpersoon(e.target.value)}
          placeholder="Contactpersoon"
          className="w-full border rounded-lg p-3"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mailadres"
          className="w-full border rounded-lg p-3"
        />

        <input
          value={telefoon}
          onChange={(e) => setTelefoon(e.target.value)}
          placeholder="Telefoonnummer"
          className="w-full border rounded-lg p-3"
        />

        <input
          value={adres}
          onChange={(e) => setAdres(e.target.value)}
          placeholder="Adres"
          className="w-full border rounded-lg p-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Postcode"
            className="w-full border rounded-lg p-3"
          />

          <input
            value={plaats}
            onChange={(e) => setPlaats(e.target.value)}
            placeholder="Plaats"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <textarea
          value={opmerkingen}
          onChange={(e) => setOpmerkingen(e.target.value)}
          placeholder="Opmerkingen"
          className="w-full border rounded-lg p-3 min-h-32"
        />

        <button
          type="submit"
          disabled={opslaan}
          className="bg-black text-white rounded-lg px-4 py-3"
        >
          {opslaan ? "Opslaan..." : "Klant opslaan"}
        </button>
      </form>

      {melding && <p className="mt-4 text-red-600">{melding}</p>}
    </main>
  );
}