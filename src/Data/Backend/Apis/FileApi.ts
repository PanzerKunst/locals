import { config } from "../../../config.ts"

export async function uploadImage(base64: string): Promise<string> {
  const result = await fetch(`${config.BACKEND_URL}/file/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64 })
  })

  if (!result.ok) {
    throw new Error("Error while uploading image")
  }

  const filePath = await result.json() as string

  return `${config.BACKEND_URL}/file/image/${filePath}`
}
