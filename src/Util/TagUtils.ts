export function asTagName(name: string, prefix: string): string {
  // Capitalize each word and remove spaces
  const capitalizedAndWithoutSpaces = name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")
  return `${prefix}${capitalizedAndWithoutSpaces}`
}
