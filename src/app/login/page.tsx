"use client";

import { useState } from "react";
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
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Inloggen</h1>

        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          type="submit"
          disabled={laden}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {laden ? "Inloggen..." : "Inloggen"}
        </button>

        {melding && <p className="mt-4 text-red-600">{melding}</p>}
      </form>
    </main>
  );
}