import dayjs from "dayjs"
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"

import App from "./UI/App"

import "dayjs/locale/sv"

import "./main.scss"

dayjs.locale("sv")

const queryClient = new QueryClient()

// @ts-ignore TS2551: Property msMaxTouchPoints does not exist on type Navigator
export const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </React.StrictMode>
)
