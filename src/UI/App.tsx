import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AccountPage } from "./AccountPage.tsx"
import { ContactPage } from "./ContactPage.tsx"
import { HomePage } from "./HomePage.tsx"
import { IndexPage } from "./IndexPage/IndexPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage.tsx"
import { RegistrationPage } from "./RegistrationPage/RegistrationPage.tsx"
import { Layout } from "./_CommonComponents/Layout.tsx"
import { AppContextProvider } from "../AppContext.tsx"

import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "home", element: <HomePage /> },
      { path: "spotify-callback", element: <HomePage /> },
      { path: "registration", element: <RegistrationPage /> },
      { path: "account", element: <AccountPage /> },
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
