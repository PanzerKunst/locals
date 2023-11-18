import dayjs from "dayjs"
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"

import "dayjs/locale/sv"
import { App } from "./UI/App.tsx"
import { getScrollbarWidth, isTouchDevice } from "./Util/BrowserUtils.ts"

import "./main.scss"

dayjs.locale("sv")

const queryClient = new QueryClient()

export const isTouch = isTouchDevice()

document.body.style.setProperty("--scrollbar-width", `${getScrollbarWidth()}px`)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </React.StrictMode>
)
