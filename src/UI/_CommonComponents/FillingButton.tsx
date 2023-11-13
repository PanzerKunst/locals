import React, { ReactElement, useEffect, useRef } from "react"

type Props = {
  children: ReactElement // Expecting a single element
}

export function FillingButton({ children }: Props) {
  const childRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setTimeout(() => {
          childRef.current?.classList.add("filling")
        }, 500) // 0.5-second delay
      }
    })

    const childElement = childRef.current
    if (childElement) {
      observer.observe(childElement)
    }

    return () => {
      if (childElement) {
        observer.unobserve(childElement)
      }
    }
  }, [])

  // Clone the child element and add the ref to it
  return React.cloneElement(children, { ref: childRef })
}
