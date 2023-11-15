import { useState, useEffect } from "react"

export function useViewportSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return size
}
