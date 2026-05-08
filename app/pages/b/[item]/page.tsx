import Header from "@/components/myComponents/Header"
import Footer from "@/components/myComponents/Footer"
import RecensionSystem from "@/components/myComponents/RecensionSystem"

import { getItemDetailPageData } from "@/controllers/item-detail.controller"

interface ItemDetailPageProps {
  params: Promise<{ item: string }>
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { item } = await params

  const {
    user,
    itemVm,
    errorType,
  } = await getItemDetailPageData(item)

  if (errorType || !itemVm) {
    return (
      <main className="p-4">
        <Header />

        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-2xl font-bold">
            Hittade inte något för &quot;{decodeURIComponent(item)}&quot;
          </h1>

          <p className="mt-2 text-sm text-base-content/60">
            Kunde inte hämta data just nu.
          </p>
        </div>

        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* Info card */}
            <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-base-content">
                {itemVm.title}
              </h1>

              {itemVm.category && (
                <p className="text-sm text-base-content/50 mt-1">
                  {itemVm.category}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="relative w-4 h-4">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-base-300 absolute inset-0"
                        fill="currentColor"
                      >
                        <path d="M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.09L12 18.77l-6.18 2.73L7 14.41 2 9.27l7.1-1.01L12 2z" />
                      </svg>

                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              (itemVm.clampedScore - i) * 100
                            )
                          )}%`,
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-amber-400"
                          fill="currentColor"
                        >
                          <path d="M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.09L12 18.77l-6.18 2.73L7 14.41 2 9.27l7.1-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                <span className="text-sm font-semibold text-base-content">
                  {Math.round(itemVm.totalScore)}
                </span>

                <span className="text-sm text-base-content/50">
                  ({itemVm.reviewsCount})
                </span>
              </div>

              {/* Address & phone */}
              <div className="mt-4 space-y-2 text-sm text-base-content/70">
                {itemVm.fullAddress && (
                  <div className="flex items-start gap-2">
                    <span>{itemVm.fullAddress}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {itemVm.phone ? (
                    <a
                      href={`tel:${itemVm.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {itemVm.phone}
                    </a>
                  ) : (
                    <span className="text-base-content/60">
                      Telefonnummer saknas
                    </span>
                  )}
                </div>

                {itemVm.website && (
                  <div className="flex items-center gap-2">
                    <a
                      href={itemVm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      Webbplats
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Info + FAQ + Hours */}
            <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm divide-y divide-base-200">
              {/* Overview */}
              <div className="p-6">
                <h2 className="text-base font-bold text-base-content mb-3">
                  Om {itemVm.title}
                </h2>

                <blockquote className="mt-4 pl-4 border-l-4 border-primary/30 text-sm italic text-base-content/60 leading-relaxed">
                  {itemVm.title}
                  {itemVm.totalScore > 0
                    ? `, betygsatt ${itemVm.totalScore.toFixed(1)}.`
                    : "."}{" "}
                  Hitta öppettider, recensioner och kontaktuppgifter för{" "}
                  {itemVm.title}.
                </blockquote>
              </div>

              {/* FAQ */}
              <div className="p-6">
                <h2 className="text-base font-bold text-base-content mb-4">
                  Vanliga frågor
                </h2>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-base-content mb-1">
                      Vilka är öppettiderna på {itemVm.title}?
                    </h3>

                    <p className="text-sm text-base-content/70 leading-relaxed">
                      Dubbelkolla öppettiderna nedan för {itemVm.title}.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-base-content mb-1">
                      Kostar det något att besöka {itemVm.title}?
                    </h3>

                    <p className="text-sm text-base-content/70 leading-relaxed">
                      Avgiftspolicyn på {itemVm.title} kan variera.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-base-content mb-1">
                      Vilka faciliteter finns på {itemVm.title}?
                    </h3>

                    <p className="text-sm text-base-content/70 leading-relaxed">
                      Kontakta platsen för fullständig information om
                      faciliteter.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="p-6">
                <h2 className="text-base font-bold text-base-content mb-4">
                  Öppettider – {itemVm.title}
                </h2>

                <table className="w-full text-sm">
                  <tbody className="divide-y divide-base-200">
                    {[
                      ["Måndag", itemVm.hours?.monday],
                      ["Tisdag", itemVm.hours?.tuesday],
                      ["Onsdag", itemVm.hours?.wednesday],
                      ["Torsdag", itemVm.hours?.thursday],
                      ["Fredag", itemVm.hours?.friday],
                      ["Lördag", itemVm.hours?.saturday],
                      ["Söndag", itemVm.hours?.sunday],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td className="py-1.5 text-base-content/70">
                          {label}
                        </td>

                        <td className="py-1.5 text-right font-medium text-base-content">
                          {value || "Öppet dygnet runt"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden sticky top-6">
              <iframe
                title="Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  itemVm.mapQuery
                )}&z=15&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />

              <div className="p-4">
                {itemVm.fullAddress && (
                  <>
                    <p className="text-sm font-medium text-base-content">
                      {itemVm.street || itemVm.title}
                    </p>

                    <p className="text-xs text-base-content/50 mt-0.5">
                      {itemVm.city} {itemVm.state}{" "}
                      {itemVm.countryCode}
                    </p>
                  </>
                )}

                {itemVm.url && (
                  <a
                    href={itemVm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-primary-content text-sm font-medium py-2.5 hover:opacity-90 transition-opacity"
                  >
                    Visa på Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecensionSystem
        userId={user?.id}
        userName={user?.user_metadata?.name ?? user?.email ?? null}
        utegymName={itemVm.title}
      />

      <Footer />
    </main>
  )
}