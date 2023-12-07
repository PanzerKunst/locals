// Capitalize each word and remove spaces
export function capitalizeAndWithoutSpaces(text: string) {
  return text.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")
}
