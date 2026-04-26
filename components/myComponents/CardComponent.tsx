"use client"

import Link from "next/link"
import Image from "next/image"

export interface dataItem {
  id?: string | number
  title?: string
  category?: string
  categoryName?: string
  totalScore?: number
  reviewsCount?: number
  street?: string
  city?: string
  state?: string
  countryCode?: string
  adress?: string
  [key: string]: string | number | boolean | null | undefined
}

interface CardComponentProps {
  item: dataItem
}

const CardComponent = ({ item }: CardComponentProps) => {
  const getRoundedNumber = (value: number | string | boolean | null | undefined) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.round(value)
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().replace(",", ".")
      const parsedValue = Number(normalizedValue)
      if (Number.isFinite(parsedValue)) {
        return Math.round(parsedValue)
      }
    }

    return 0
  }

  const getNumberValue = (value: number | string | boolean | null | undefined) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().replace(",", ".")
      const parsedValue = Number(normalizedValue)
      if (Number.isFinite(parsedValue)) {
        return parsedValue
      }
    }

    return 0
  }

  // Basic fields
  const title = item["title"] ?? "Missing title"
  const imageUrl = "/icon.jpg" // served from /public
  //const category =
    //item["category"] ?? item["categoryName"] ?? "Missing category"

  // Rating fields
  const totalScoreRaw = getNumberValue(item["totalScore"])
  const totalScore = getRoundedNumber(item["totalScore"])
  const reviewsCount = getRoundedNumber(item["reviewsCount"])
  const scoreForStars = Math.max(0, Math.min(5, totalScoreRaw))

  // Address line: street, city, state, countryCode, adress
  const fullAddress = [
    item["street"],
    item["city"],
    item["state"],
    item["countryCode"],
    item["adress"],
  ]
    .filter(Boolean)
    .join(", ")

  // Detail route: use title for the detail page slug
  const detailKey = title

  return (
    <div className="card bg-base-100 w-96 shadow-sm group overflow-hidden">
      {imageUrl && (
        <figure className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
      )}

      <div className="card-body w-full max-w-full overflow-hidden">
        {/* Title */}
        <h2 className="card-title font-bold text-lg leading-tight break-words">
          {title}
        </h2>

        {/* Rating: stars + (reviewsCount) */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="relative w-4 h-4">
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
                      Math.min(100, (scoreForStars - index) * 100)
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
          <span className="text-xs font-semibold text-base-content/80 leading-none">
            {totalScore}
          </span>
          <span className="text-xs text-base-content/50 leading-none">
            ({reviewsCount})
          </span>
        </div>

        {/* Address line */}
        {fullAddress && (
          <p className="text-sm text-base-content/80 mt-2 break-words">
            {fullAddress}
          </p>
        )}

        {/* Button aligned to the right */}
        <div className="card-actions justify-end mt-4">
          <Link
            href={`/pages/b/${encodeURIComponent(detailKey)}`}
            className="btn btn-sm btn-primary rounded-full"
          >
            Visa
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CardComponent
