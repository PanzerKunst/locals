import { removeAccents, removePunctuation } from "./StringUtils.ts"

export function asTag(text: string) {
  const withoutAccents = removeAccents(text)

  return removePunctuation(withoutAccents)
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join("")
}
