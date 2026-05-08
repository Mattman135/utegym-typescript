import { createClient } from "@/libs/supabase/server"
import { getItemDetailVm } from "@/services/item-detail.service"

interface ControllerResult {
  user: any
  itemVm: Awaited<ReturnType<typeof getItemDetailVm>>
  errorType: "NOT_FOUND" | "DATABASE" | null
}

export async function getItemDetailPageData(
  encodedItemName: string,
): Promise<ControllerResult> {
  const itemName = decodeURIComponent(
    encodedItemName,
  )

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const itemVm = await getItemDetailVm(itemName)

  if (!itemVm) {
    return {
      user,
      itemVm: null,
      errorType: "NOT_FOUND",
    }
  }

  return {
    user,
    itemVm,
    errorType: null,
  }
}