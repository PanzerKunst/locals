/* Doesn't seem necessary
export function useDeepCompareEffect(callback: EffectCallback, dependencies: DependencyList): void {
  const currentDependenciesRef = useRef<DependencyList>()

  if (!_isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  useEffect(callback, [currentDependenciesRef.current]) // eslint-disable-line react-hooks/exhaustive-deps
} */

import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
