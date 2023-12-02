import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AccountPage } from "./AccountPage.tsx"
import { ComposePage } from "./ComposePage.tsx"
import { ContactPage } from "./ContactPage.tsx"
import { HomePage } from "./HomePage.tsx"
import { LandingPage } from "./LandingPage/LandingPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage.tsx"
import { RegisterPage } from "./RegisterPage/RegisterPage.tsx"
import { Layout } from "./_CommonComponents/Layout.tsx"
import { AppContextProvider } from "../AppContext.tsx"

import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "home", element: <HomePage /> },
      { path: "spotify-callback", element: <HomePage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "compose", element: <ComposePage /> },
      { path: "contact", element: <ContactPage /> },
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
