import { CircularProgress } from "@mui/joy"

import "./CircularLoader.scss"

export function CircularLoader() {
  return (
    <div className="circular-loader">
      <CircularProgress variant="plain"/>
    </div>
  )
}
