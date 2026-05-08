import { createClient } from "@/libs/supabase/server"

export class ItemRepository {
  private tableName: string

  constructor(tableName: string = "utegym_data") {
    this.tableName = tableName
  }

  /**
   * Fetch all items from the database
   */
  async getAllItems() {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .order("title", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`)
    }

    return data ?? []
  }
}