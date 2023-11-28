import { CircularProgress } from "@mui/joy"

import "./CircularLoader.scss"

type Props = {
  size?: "sm" | "md";
}

export function CircularLoader({ size = "md" }: Props) {
  return (
    <div className="circular-loader">
      <CircularProgress variant="plain" size={size}/>
    </div>
  )
}
