import dayjs from "dayjs"
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"

import "dayjs/locale/sv"
import { App } from "./UI/App.tsx"
import { getScrollbarWidth, isTouchDevice } from "./Util/BrowserUtils.ts"
import { config } from "./config.ts"

import "./main.scss"

dayjs.locale("sv")

export const isTouch = isTouchDevice()

document.body.style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`)

// TODO: remove
console.log("IS_PROD", config.IS_PROD)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <App/>
    </QueryClientProvider>
  </React.StrictMode>
)
