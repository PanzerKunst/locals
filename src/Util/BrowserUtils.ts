import { useState, useEffect } from "react"

export function getUrlQueryParam(name: string): string | undefined {
  return new URLSearchParams(window.location.search).get(name) || undefined
}

export function hasUrlQueryParam(name: string): boolean {
  return new URLSearchParams(window.location.search).has(name)
}

export function isTouchDevice() {
  // @ts-ignore TS2551: Property msMaxTouchPoints does not exist on type Navigator
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}

export function useViewportSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    function handleResize() {
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

export function scrollIntoView(element: Element | null, delaySeconds: number | undefined = 0): void {
  if (!element || isInViewport(element)) {
    return
  }

  setTimeout(() => {
    element.scrollIntoView({ behavior: "smooth" })
  }, delaySeconds * 1000)
}

export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
