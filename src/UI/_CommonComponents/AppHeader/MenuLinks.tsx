import { motion, stagger, useAnimate } from "framer-motion"
import { useEffect } from "react"
import { Link } from "react-router-dom"

import { useAppContext } from "../../../AppContext.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../../../Util/AppUrlQueryParams.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"

type Props = {
  closeMenu: () => void;
}

const motionVariants = {
  initial: { opacity: 0, y: 50, filter: "blur(0.2em)" },
  animate: { opacity: 1, y: 0, filter: "blur(0)" }
}

export function MenuLinks({ closeMenu }: Props) {
  const { loggedInUser } = useAppContext()
  const [scope, animate] = useAnimate()

  useEffect(() => {
    void animate(
      "li",
      motionVariants.animate,
      {
        duration: Number(s.animationDurationSm),
        delay: stagger(Number(s.animationDurationXs))
      }
    )
  }, [animate, scope])

  return (
    <ul ref={scope} className="styleless">
      {loggedInUser && (
        <>
          <motion.li initial={motionVariants.initial}>
            <Link to="/settings" className="underlined appears" onClick={closeMenu}>Settings</Link>
          </motion.li>
          <motion.li initial={motionVariants.initial}>
            <Link to="/compose" className="underlined appears" onClick={closeMenu}>Compose</Link>
          </motion.li>
          <motion.li initial={motionVariants.initial}>
            <Link to={`/?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.SIGN_OUT}`} className="underlined appears" onClick={closeMenu}>Sign out</Link>
          </motion.li>
        </>
      )}
    </ul>
  )
}
