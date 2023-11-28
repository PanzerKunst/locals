import { Outlet, ScrollRestoration } from "react-router-dom"

import { AppFooter } from "./AppFooter.tsx"
import { AppHeader } from "./AppHeader/AppHeader.tsx"
import { CookieSnackbar } from "./Snackbar/CookieSnackbar.tsx"

import "./Layout.scss"

export function Layout() {
  return (
    <>
      <AppHeader/>
      <Outlet />
      <AppFooter/>
      <CookieSnackbar/>
      <ScrollRestoration />
    </>
  )
}
