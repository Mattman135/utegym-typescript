import type {
  NewRecensionInput,
  Recension,
  ReviewRow,
  UserLike,
} from "@/types/recension"

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function mapReviewRowToRecension(
  row: ReviewRow,
): Recension {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userInitials: getInitials(row.user_name),
    rating: row.rating,
    title: row.review_title,
    comment: row.review_text,
    image: row.photo_url,
    createdAt: new Date(row.created_at),
    likes: 0,
    dislikes: 0,
    userLike: null,
  }
}

export function buildCreateRecensionPayload(
  input: NewRecensionInput,
  userId: string,
  userName: string,
  utegymName: string,
  photoUrl: string | null,
) {
  const safeUserName =
    userName.trim() || "Anonymous User"

  return {
    user_id: userId,
    user_name: safeUserName,
    utegym_name: utegymName,
    review_title: input.title,
    review_text: input.comment,
    photo_url: photoUrl,
    rating: input.rating,
  }
}

export function toggleRecensionLike(
  recensions: Recension[],
  recensionId: number,
  action: Exclude<UserLike, null>,
): Recension[] {
  return recensions.map((recension) => {
    if (recension.id !== recensionId) {
      return recension
    }

    const currentLike = recension.userLike
    let newLikes = recension.likes
    let newDislikes = recension.dislikes
    let newUserLike: UserLike = null

    if (currentLike === action) {
      if (action === "like") {
        newLikes -= 1
      }
      if (action === "dislike") {
        newDislikes -= 1
      }
    } else {
      if (currentLike === "like") {
        newLikes -= 1
      }
      if (currentLike === "dislike") {
        newDislikes -= 1
      }

      if (action === "like") {
        newLikes += 1
      }
      if (action === "dislike") {
        newDislikes += 1
      }
      newUserLike = action
    }

    return {
      ...recension,
      likes: newLikes,
      dislikes: newDislikes,
      userLike: newUserLike,
    }
  })
}

export function getAverageRating(
  recensions: Recension[],
): string {
  if (!recensions.length) {
    return "0.0"
  }

  const total = recensions.reduce(
    (sum, recension) => sum + recension.rating,
    0,
  )

  return (total / recensions.length).toFixed(1)
}

export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return "just now"
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  if (hours < 24) {
    return `${hours}h ago`
  }
  if (days < 7) {
    return `${days}d ago`
  }
  if (days < 30) {
    return `${Math.floor(days / 7)}w ago`
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
