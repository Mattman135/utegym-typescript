import { getUtegymByTitle } from "@/repositories/utegym.repository"
import {
  DataItem,
  ItemDetailViewModel,
} from "@/types/item-details"

function parseNumber(
  value: number | string | undefined,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(
      value.trim().replace(",", "."),
    )

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return 0
}

export async function getItemDetailVm(
  itemName: string,
): Promise<ItemDetailViewModel | null> {
  const item = await getUtegymByTitle(itemName)

  if (!item) {
    return null
  }

  const totalScore = parseNumber(item.totalScore)

  const reviewsCount = Math.round(
    parseNumber(item.reviewsCount),
  )

  const clampedScore = Math.max(
    0,
    Math.min(5, totalScore),
  )

  const category =
    item.category ?? item.categoryName ?? null

  const fullAddress = [
    item.street,
    item.city,
    item.state,
    item.countryCode,
    item.adress,
  ]
    .filter(Boolean)
    .join(", ")

  const mapQuery =
    fullAddress ||
    item.title ||
    item.city ||
    "Sweden"

  return {
    title: item.title ?? "Unknown",

    category,

    totalScore,
    reviewsCount,
    clampedScore,

    fullAddress,
    mapQuery,

    phone: item.phone,
    website: item.website,
    url: item.url,

    city: item.city,
    state: item.state,
    countryCode: item.countryCode,
    street: item.street,

    hours: item.hours,
  }
}