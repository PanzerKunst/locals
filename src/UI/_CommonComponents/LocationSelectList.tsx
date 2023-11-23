import { useEffect, useRef, useState } from "react"

import { CircularLoader } from "./CircularLoader.tsx"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"


import "./LocationSelectList.scss"

type Props = {
  locations: GeoapifyFeature[];
  onSelect: (geoapifyFeature: GeoapifyFeature) => void; // eslint-disable-line no-unused-vars
  isLoading?: boolean;
}

// TODO: remove
/* eslint-disable */

export function LocationSelectList({ locations, onSelect, isLoading = false }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const dropdownRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setIsOpen(true)
  }, [locations, isLoading])

  // TODO: remove
  console.log("LocationSelectList", {
    isLoading,
    locations,
    isOpen,
  })

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

      // TODO: remove
      console.log("LocationSelectList > handleOutsideClick > setIsOpen(false)")

      setIsOpen(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {

      // TODO: remove
      console.log("LocationSelectList > handleKeyDown > setIsOpen(false)")

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
    <ul ref={dropdownRef} className="styleless select">
      {isLoading ? (
        <li>
          <CircularLoader />
        </li>
      ) : (
        locations.map((geoapifyFeature) => (
          <li key={geoapifyFeature.place_id} onClick={() => handleClick(geoapifyFeature)}>
            {geoapifyFeature.formatted}
          </li>
        ))
      )}
    </ul>
  )
}
