export type Field = {
  value: string;
  error: string;
}

export function isValidEmail(email: string): boolean {
  const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  return regex.test(email)
}

export function isValidUsername(username: string): boolean {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9-_.]+$/
  return regex.test(username)
}

export function isOnlyDigitsAndNotEmpty(value: string | undefined): boolean {
  const regex = /^\d+$/
  return regex.test(value || "")
}

export function isBase64(value: string | undefined): boolean {
  const regex = /^data:([A-Za-z-+/]+);base64,(.+)$/
  return regex.test(value || "")
}

export function isValidIsoDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/

  if (!regex.test(dateString)) {
    return false
  }

  const date = new Date(dateString)
  return date.toISOString() === dateString
}
