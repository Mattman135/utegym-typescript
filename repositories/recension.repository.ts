import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  CreateRecensionPayload,
  ReviewRow,
} from "@/types/recension"

const TABLE_NAME = "reviews"
const STORAGE_BUCKET = "review-photos"
const REVIEW_SELECT =
  "id, user_id, user_name, utegym_name, review_title, review_text, photo_url, rating, created_at"

export function createRecensionRepository(
  supabase: SupabaseClient,
) {
  return {
    async getByUtegymName(
      utegymName: string,
    ): Promise<ReviewRow[] | null> {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(REVIEW_SELECT)
        .eq("utegym_name", utegymName)
        .order("created_at", { ascending: false })

      if (error || !data) {
        return null
      }

      return data as ReviewRow[]
    },

    async uploadPhoto(
      userId: string,
      imageFile: File,
    ): Promise<string | null> {
      const extension =
        imageFile.name.split(".").pop() ?? "jpg"
      const filePath = `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, imageFile)

      if (uploadError || !uploadData) {
        return null
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(uploadData.path)

      return publicUrlData.publicUrl
    },

    async create(
      payload: CreateRecensionPayload,
    ): Promise<ReviewRow | null> {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select(REVIEW_SELECT)
        .single()

      if (error || !data) {
        return null
      }

      return data as ReviewRow
    },
  }
}
