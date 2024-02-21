import { Outlet } from "react-router-dom"

import "./Layout.scss"

export function LayoutFertility() {
  return (
    <>
      {/* <AppHeader/> */}
      <Outlet />
      {/* <AppFooter/>
      <CookieSnackbar/>
      <ScrollRestoration /> */}
    </>
  )
}
