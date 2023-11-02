import dayjs from "dayjs"
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"

import App from "./UI/App"
import "dayjs/locale/sv"

import "./main.scss"

dayjs.locale("sv")

const queryClient = new QueryClient()

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App/>
    </QueryClientProvider>
  </React.StrictMode>
)
