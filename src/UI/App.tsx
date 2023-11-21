import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom"

import { HomePage } from "./HomePage/HomePage.tsx"
import { IndexPage } from "./IndexPage/IndexPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage/PrivacyPolicyPage.tsx"
import { RegistrationStep1 } from "./RegistrationStep1/RegistrationStep1.tsx"
import { AppFooter } from "./_CommonComponents/AppFooter.tsx"
import { AppHeader } from "./_CommonComponents/AppHeader/AppHeader.tsx"
import { AppContextProvider } from "../AppContext.tsx"

import "./App.scss"

function Layout() {
  return (
    <>
      <AppHeader/>
      <Outlet />
      <AppFooter/>
      <ScrollRestoration />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "home", element: <HomePage /> },
      { path: "spotify-callback", element: <HomePage /> },
      { path: "registration-step-1", element: <RegistrationStep1 /> },
      { path: "privacy", element: <PrivacyPolicyPage /> }
    ]
  }
])

export function App() {
  return (
    <AppContextProvider>
      <RouterProvider router={router}/>
    </AppContextProvider>
  )
}
