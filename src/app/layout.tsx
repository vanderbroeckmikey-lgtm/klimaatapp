import "./globals.css";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="bg-gray-50 text-black">
        <header className="border-b bg-white">
          <nav className="max-w-6xl mx-auto p-4 flex gap-4 items-center">
            <Link href="/">Dashboard</Link>
            <Link href="/klanten">Klanten</Link>
            <Link href="/klanten/nieuw">Nieuwe klant</Link>
            <LogoutButton />
          </nav>
        </header>

        <div className="max-w-6xl mx-auto">{children}</div>
      </body>
    </html>
  );
}