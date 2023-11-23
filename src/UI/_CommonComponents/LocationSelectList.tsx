import { useEffect, useRef, useState } from "react"

import { CircularLoader } from "./CircularLoader.tsx"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"


import "./LocationSelectList.scss"

type Props = {
  locations: GeoapifyFeature[];
  onSelect: (geoapifyFeature: GeoapifyFeature) => void; // eslint-disable-line no-unused-vars
  isLoading?: boolean;
}

export function LocationSelectList({ locations, onSelect, isLoading = false }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const dropdownRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setIsOpen(true)
  }, [locations, isLoading])

  function handleOutsideClick(event: MouseEvent) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleClick = (geoapifyFeature: GeoapifyFeature) => {
    onSelect(geoapifyFeature)
    setIsOpen(true)
  }

  // TODO: add stagger animnation https://www.framer.com/motion/stagger/

  if (!isOpen) {
    return undefined
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
    <ul role="listbox" ref={dropdownRef} className="styleless select">
      {isLoading ? (
        <li>
          <CircularLoader />
        </li>
      ) : (
        locations.map((geoapifyFeature) => ( // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <li
            key={geoapifyFeature.place_id}
            onClick={() => handleClick(geoapifyFeature)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected="false"
          >
            {geoapifyFeature.formatted}
          </li>
        ))
      )}
    </ul>
  )
}
