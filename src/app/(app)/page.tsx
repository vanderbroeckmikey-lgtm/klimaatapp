export default function DashboardPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Interne bedrijfsapp
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welkom bij Klimaattechniek Benelux
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Beheer klanten, opdrachten en documenten overzichtelijk op één plek.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Klanten</p>
          <h2 className="mt-2 text-3xl font-bold">--</h2>
          <p className="mt-2 text-sm text-gray-600">
            Totaal aantal geregistreerde klanten
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Open opdrachten</p>
          <h2 className="mt-2 text-3xl font-bold">--</h2>
          <p className="mt-2 text-sm text-gray-600">
            Lopende werkzaamheden en installaties
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Uploads</p>
          <h2 className="mt-2 text-3xl font-bold">--</h2>
          <p className="mt-2 text-sm text-gray-600">
            Foto’s, werkbonnen en documenten
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Snelle acties</h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/klanten/nieuw"
              className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 transition"
            >
              Nieuwe klant
            </a>

            <a
              href="/klanten"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 hover:bg-red-100 transition"
            >
              Klanten bekijken
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Overzicht</h3>
          <p className="mt-4 text-gray-600">
            Deze app wordt gebruikt voor klantenbeheer, opdrachten, foto’s,
            documenten en later ook installaties en planning.
          </p>
        </div>
      </section>
    </main>
  );
}