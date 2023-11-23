import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom"

import { HomePage } from "./HomePage/HomePage.tsx"
import { IndexPage } from "./IndexPage/IndexPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage/PrivacyPolicyPage.tsx"
import { RegistrationPage } from "./RegistrationPage/RegistrationPage.tsx"
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

// TODO: add page transitions https://codesandbox.io/s/framer-motion-react-router-6-page-transitions-2f2olf?from-embed=&file=/src/template/Gallery.tsx

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "home", element: <HomePage /> },
      { path: "spotify-callback", element: <HomePage /> },
      { path: "registration", element: <RegistrationPage /> },
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
