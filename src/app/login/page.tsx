"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [melding, setMelding] = useState("");
  const [laden, setLaden] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setMelding("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLaden(false);

    if (error) {
      setMelding(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
        <div className="hidden md:flex flex-col justify-between bg-neutral-900 text-white p-10">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/logo.jpg"
                alt="Klimaattechniek Benelux"
                width={56}
                height={56}
                className="rounded-lg bg-white p-1 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">Klimaattechniek Benelux</h1>
                <p className="text-sm text-neutral-300">
                  Interne bedrijfsapp
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Snel toegang tot klanten,
              <span className="text-red-400"> opdrachten </span>
              en documenten.
            </h2>

            <p className="text-neutral-300 leading-7">
              Werk overzichtelijk vanuit kantoor of op locatie. Beheer klanten,
              werkbonnen, installaties en bestanden op één centrale plek.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-neutral-300">
              Klimaattechniek Benelux
            </p>
            <p className="mt-1 text-lg font-semibold">
              Airco installatie, onderhoud en service
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10 flex items-center">
          <div className="w-full">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <Image
                src="/logo.png"
                alt="Klimaattechniek Benelux"
                width={46}
                height={46}
                className="rounded-lg object-contain"
              />
              <div>
                <h1 className="font-bold">Klimaattechniek Benelux</h1>
                <p className="text-sm text-neutral-500">Interne bedrijfsapp</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2">Inloggen</h2>
            <p className="text-neutral-500 mb-8">
              Log in om klanten, opdrachten en bestanden te beheren.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  E-mailadres
                </label>
                <input
                  type="email"
                  placeholder="naam@bedrijf.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <button
                type="submit"
                disabled={laden}
                className="w-full rounded-xl bg-red-700 px-4 py-3 font-semibold text-white hover:bg-red-800 transition disabled:opacity-70"
              >
                {laden ? "Inloggen..." : "Inloggen"}
              </button>

              {melding && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {melding}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}