import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { ContactPage } from "./ContactPage/ContactPage.tsx"
import { HomePage } from "./HomePage/HomePage.tsx"
import { IndexPage } from "./IndexPage/IndexPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage/PrivacyPolicyPage.tsx"
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
