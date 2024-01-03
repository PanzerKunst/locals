import { config } from "../../../config.ts"

export async function uploadBase64Image(base64: string): Promise<string> {
  const result = await fetch(`${config.BACKEND_URL}/file/image/base64`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64 })
  })

  if (!result.ok) {
    throw new Error("Error while uploading base64 image")
  }

  return await result.json() as string
}

export async function uploadFormDataImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)

  const result = await fetch(`${config.BACKEND_URL}/file/image/form-data`, {
    method: "POST",
    body: formData
  })

  if (!result.ok) {
    throw new Error("Error while uploading FormData image")
  }

  return await result.json() as string
}

export async function deleteFile(filePath: string): Promise<void> {
  const result = await fetch(`${config.BACKEND_URL}/file/${filePath}`, {
    method: "DELETE"
  })

  if (!result.ok) {
    throw new Error(`Error while deleting file ${filePath}`)
  }
}
