import { capitalizeAndWithoutSpaces } from "./StringUtils.ts"

export function asTag(name: string, prefix: string): string {
  return `${prefix}${capitalizeAndWithoutSpaces(name)}`
}
