import { motion, stagger, useAnimate } from "framer-motion"
import _isEmpty from "lodash/isEmpty"
import { ReactNode, useEffect, useState } from "react"
import { LinearProgress } from "@mui/joy"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./SelectList.scss"

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode; // eslint-disable-line no-unused-vars
  onSelect: (item: T) => void; // eslint-disable-line no-unused-vars
  loading?: boolean;
}

const motionVariants = {
  initial: { opacity: 0, y: 25, filter: "blur(0.2em)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" }
}

export function SelectList<T>({ items, renderItem, onSelect, loading = false }: Props<T>) {
  const [isOpen, setIsOpen] = useState(true)
  const [scope, animate] = useAnimate()

  useEffect(() => {
    // TODO: Remove
    console.log("useEffect 1", scope.current, items)

    if (!scope.current) {
      return
    }

    setIsOpen(true)
  }, [items, loading, scope])

  useEffect(() => {
    // TODO: Remove
    console.log("useEffect 2", scope.current, items)

    if (!scope.current || _isEmpty(items)) {
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
  }, [animate, scope, items])

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

  const handleClick = (item: T) => {
    onSelect(item)
    setIsOpen(true)
  }

  if (!isOpen) {
    return undefined
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
    <ul ref={scope} role="listbox" className="styleless select">
      {loading ? (
        <li className="loading">
          <LinearProgress variant="plain" />
        </li>
      ) : (
        items.map((item) => ( // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <motion.li initial={motionVariants.initial}
            key={JSON.stringify(item)}
            onClick={() => handleClick(item)}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
            role="option"
            aria-selected="false"
          >
            {renderItem(item)}
          </motion.li>
        ))
      )}
    </ul>
  )
}
