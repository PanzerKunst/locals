import { BezierDefinition, Easing } from "framer-motion"

// https://cubic-bezier.com/
export const easeOutFast: BezierDefinition = [0, 1, 0.5, 1]

export const defaultFadeInDelay = 0.1

export type MotionTransition = {
  duration: number;
  ease: Easing | Easing[];
}

export function scrollIntoView(element: HTMLElement | null, delaySeconds: number | undefined = 0): void {
  setTimeout(() => {
    element?.scrollIntoView({ behavior: "smooth" })
  }, delaySeconds * 1000)
}
