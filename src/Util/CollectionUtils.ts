export function withoutNullish<T>(arr: (T | null | undefined)[] | null | undefined): T[] {
  if (!arr) {
    return []
  }

  return arr.reduce((res, el) => {
    if (el) {
      res.push(el)
    }

    return res
  }, [] as T[])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArrayOfStrings(arr: any) {
  return Array.isArray(arr) && arr.every(item => typeof item === "string")
}
