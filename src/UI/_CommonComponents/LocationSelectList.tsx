import { useEffect, useState } from "react"
import _isEmpty from "lodash/isEmpty"

import { CircularLoader } from "./CircularLoader.tsx"
import { GeoapifyFeature } from "../../Data/Geoapify/Models/GeoapifyFeature.ts"

import { motion, stagger, useAnimate } from "framer-motion"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./LocationSelectList.scss"

type Props = {
  locations: GeoapifyFeature[];
  onSelect: (geoapifyFeature: GeoapifyFeature) => void; // eslint-disable-line no-unused-vars
  loading?: boolean;
}

const motionVariants = {
  initial: { opacity: 0, y: 25, filter: "blur(0.2em)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" }
}

export function LocationSelectList({ locations, onSelect, loading = false }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [scope, animate] = useAnimate()

  useEffect(() => {
    setIsOpen(true)
  }, [locations, loading])

  useEffect(() => {
    if (_isEmpty(locations)) {
      return
    }

    animate(
      "li",
      motionVariants.animate,
      {
        duration: Number(s.animationDurationSm),
        delay: stagger(Number(s.animationDurationXs))
      }
    )
  }, [animate, scope, locations])

  function handleOutsideClick(event: MouseEvent) {
    if (scope.current && !scope.current.contains(event.target as Node)) {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (geoapifyFeature: GeoapifyFeature) => {
    onSelect(geoapifyFeature)
    setIsOpen(true)
  }

  if (!isOpen) {
    return undefined
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
    <ul ref={scope} role="listbox" className="styleless select">
      {loading ? (
        <li>
          <CircularLoader />
        </li>
      ) : (
        locations.map((geoapifyFeature) => ( // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <motion.li initial={motionVariants.initial}
            key={geoapifyFeature.place_id}
            onClick={() => handleClick(geoapifyFeature)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected="false"
          >
            {geoapifyFeature.formatted}
          </motion.li>
        ))
      )}
    </ul>
  )
}
