import { createClient } from "@/libs/supabase/server"
import { DataItem, ItemDetailViewModel } from "@/types/item-details"

const TABLE_NAME = "utegym_data"

export async function getUtegymByTitle(
  title: string,
): Promise<DataItem | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .ilike("title", title)
    .single()

  if (error || !data) {
    return null
  }

  return data as DataItem
}