"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout-button";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/klanten", label: "Klanten" },
  { href: "/installaties", label: "Installaties" },
  { href: "/werkbonnen", label: "Werkbonnen" },
  { href: "/koudemiddel", label: "Koudemiddelvoorraad" },
  { href: "/klanten/nieuw", label: "Nieuwe klant" },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Klimaattechniek Benelux"
                width={42}
                height={42}
                className="object-contain"
              />
              <div>
                <div className="text-lg font-bold text-red-600">
                  Klimaat Techniek Benelux
                </div>
                <div className="text-xs text-gray-500">
                  Interne bedrijfsapp
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {links.map((link) => {
              const actief =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    actief
                      ? "block rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-medium text-red-700"
                      : "block rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-100"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <LogoutButton />
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
              <div>
                <h1 className="text-xl font-bold">Klimaattechniek Benelux</h1>
                <p className="text-sm text-gray-500">
                  Klanten, opdrachten en bestanden beheren
                </p>
              </div>

              <div className="md:hidden">
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}