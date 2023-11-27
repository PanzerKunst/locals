import { motion } from "framer-motion"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

type PathProps = {
  variants: {
    closed: object;
    open: object;
  }
  d?: string;
  transition?: object;
}

function Path(props: PathProps) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <motion.path
      fill="transparent"
      strokeWidth="3"
      stroke={s.colorIcon}
      strokeLinecap="round"
      {...props}
    />
  )
}

type Props = {
  onToggle: () => void;
}

export function MenuToggle({ onToggle }: Props) {
  return (
    <button className="icon-only" aria-label="menu" onClick={onToggle}>
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" }
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }
          }}
          transition={{ duration: Number(s.animationDurationXs) }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" }
          }}
        />
      </svg>
    </button>
  )
}
