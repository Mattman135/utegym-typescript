import { createClient } from "@/libs/supabase/client"
import { createRecensionRepository } from "@/repositories/recension.repository"
import {
  buildCreateRecensionPayload,
  mapReviewRowToRecension,
} from "@/services/recension.service"
import type {
  NewRecensionInput,
  Recension,
} from "@/types/recension"

interface LoadRecensionsResult {
  recensions: Recension[]
  errorType: "LOAD_FAILED" | null
}

interface CreateRecensionResult {
  recension: Recension | null
  errorType:
    | "NOT_LOGGED_IN"
    | "MISSING_UTEGYM_NAME"
    | "PHOTO_UPLOAD_FAILED"
    | "SAVE_FAILED"
    | null
}

interface CreateRecensionOptions {
  input: NewRecensionInput
  userId?: string
  userName?: string | null
  utegymName?: string
}

export async function loadRecensionsByUtegymName(
  utegymName?: string,
): Promise<LoadRecensionsResult> {
  if (!utegymName) {
    return {
      recensions: [],
      errorType: null,
    }
  }

  const repository = createRecensionRepository(
    createClient(),
  )

  const rows = await repository.getByUtegymName(
    utegymName,
  )

  if (!rows) {
    return {
      recensions: [],
      errorType: "LOAD_FAILED",
    }
  }

  return {
    recensions: rows.map(mapReviewRowToRecension),
    errorType: null,
  }
}

export async function createRecension(
  options: CreateRecensionOptions,
): Promise<CreateRecensionResult> {
  const { input, userId, userName, utegymName } = options

  if (!userId || !userName) {
    return {
      recension: null,
      errorType: "NOT_LOGGED_IN",
    }
  }

  if (!utegymName) {
    return {
      recension: null,
      errorType: "MISSING_UTEGYM_NAME",
    }
  }

  const repository = createRecensionRepository(
    createClient(),
  )

  let photoUrl: string | null = null

  if (input.imageFile) {
    photoUrl = await repository.uploadPhoto(
      userId,
      input.imageFile,
    )

    if (!photoUrl) {
      return {
        recension: null,
        errorType: "PHOTO_UPLOAD_FAILED",
      }
    }
  }

  const created = await repository.create(
    buildCreateRecensionPayload(
      input,
      userId,
      userName,
      utegymName,
      photoUrl,
    ),
  )

  if (!created) {
    return {
      recension: null,
      errorType: "SAVE_FAILED",
    }
  }

  return {
    recension: mapReviewRowToRecension(created),
    errorType: null,
  }
}
