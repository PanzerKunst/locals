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
