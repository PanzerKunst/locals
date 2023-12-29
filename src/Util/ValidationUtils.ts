export type Field = {
  value: string;
  error: string;
}

const EMAIL_FORMAT_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

export function isEmailValid(email: string): boolean {
  return EMAIL_FORMAT_REGEXP.test(email)
}


const USERNAME_FORMAT_REGEXP = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9-_.]+$/

export function isUsernameValid(username: string): boolean {
  return USERNAME_FORMAT_REGEXP.test(username)
}


const ONLY_DIGITS_AND_NOT_EMPTY_REGEXP = /^\d+$/

export function isOnlyDigitsAndNotEmpty(value: string | undefined): boolean {
  return ONLY_DIGITS_AND_NOT_EMPTY_REGEXP.test(value || "")
}


const BASE_64 = /^data:([A-Za-z-+/]+);base64,(.+)$/

export function isBase64(value: string | undefined): boolean {
  return BASE_64.test(value || "")
}
