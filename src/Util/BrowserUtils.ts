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

export function getScrollbarWidth() {
  // Create the outer container
  const outer = document.createElement("div")
  outer.style.visibility = "hidden"
  outer.style.overflow = "scroll" // Force scrollbar to appear
  // @ts-ignore TS2339: Property msOverflowStyle does not exist on type CSSStyleDeclaration
  outer.style.msOverflowStyle = "scrollbar" // Needed for WinJS apps
  document.body.appendChild(outer)

  // Create the inner container
  const inner = document.createElement("div")
  outer.appendChild(inner)

  // Calculate the scrollbar width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Remove the containers from the DOM
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
