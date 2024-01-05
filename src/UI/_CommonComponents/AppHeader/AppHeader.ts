import { useEffect } from "react"

import { useAppContext } from "../../../AppContext.tsx"

export function useHeaderTitle(title: string) {
  const { setHeaderTitle } = useAppContext()

  useEffect(() => {
    setHeaderTitle(title)
    return () => setHeaderTitle(undefined)
  }, [setHeaderTitle, title])
}
