export type UserLike = "like" | "dislike" | null

export interface Recension {
  id: number
  userId: string
  userName: string
  userInitials: string
  rating: number
  title: string
  comment: string
  image: string | null
  createdAt: Date
  likes: number
  dislikes: number
  userLike: UserLike
}

export interface NewRecensionInput {
  rating: number
  title: string
  comment: string
  imageFile: File | null
}

export interface FormErrors {
  title?: string
  comment?: string
  image?: string
}

export interface ReviewRow {
  id: number
  user_id: string
  user_name: string
  utegym_name: string
  review_title: string
  review_text: string
  photo_url: string | null
  rating: number
  created_at: string
}

export interface CreateRecensionPayload {
  user_id: string
  user_name: string
  utegym_name: string
  review_title: string
  review_text: string
  photo_url: string | null
  rating: number
}
