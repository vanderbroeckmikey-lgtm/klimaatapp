import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/logout-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/logo.jpg"
                alt="Klimaattechniek Benelux"
                width={42}
                height={42}
                className="rounded-md object-contain"
              />
              <div className="leading-tight">
                <div className="font-bold text-sm md:text-base">
                  Klimaattechniek Benelux
                </div>
                <div className="text-xs text-neutral-500">
                  Installatie & service
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm md:text-base">
              <Link href="/" className="hover:text-red-700 transition">
                Dashboard
              </Link>
              <Link href="/klanten" className="hover:text-red-700 transition">
                Klanten
              </Link>
              <Link
                href="/klanten/nieuw"
                className="hover:text-red-700 transition"
              >
                Nieuwe klant
              </Link>
            </div>

            <div className="ml-auto">
              <LogoutButton />
            </div>
          </nav>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}