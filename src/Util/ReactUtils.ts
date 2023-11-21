/* Doesn't seem necessary
export function useDeepCompareEffect(callback: EffectCallback, dependencies: DependencyList): void {
  const currentDependenciesRef = useRef<DependencyList>()

  if (!_isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies
  }

  useEffect(callback, [currentDependenciesRef.current]) // eslint-disable-line react-hooks/exhaustive-deps
} */
