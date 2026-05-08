export interface OpeningHours {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
}
  
export interface dataItem {
    title?: string
    category?: string
    categoryName?: string
    totalScore?: number | string
    reviewsCount?: number | string
    street?: string
    city?: string
    state?: string
    countryCode?: string
    adress?: string
    phone?: string
    website?: string
    url?: string
    hours?: OpeningHours
}