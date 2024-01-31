import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AtTagPage } from "./AtTagPage.tsx"
import { ComposePage } from "./ComposePages/ComposePage.tsx"
import { PreviewPostPage } from "./ComposePages/PreviewPostPage.tsx"
import { PublishPage } from "./ComposePages/PublishPage.tsx"
import { MyPostsPage } from "./CreatorDashboardPages/MyPostsPage.tsx"
import { HomePage } from "./HomePage/HomePage.tsx"
import { LandingPage } from "./LandingPage/LandingPage.tsx"
import { PostPage } from "./PostPage.tsx"
import { RegisterPage } from "./RegisterPage/RegisterPage.tsx"
import { AccountPage } from "./SettingsPages/AccountPage.tsx"
import { SubscriptionsPage } from "./SettingsPages/Subscriptions/SubscriptionsPage.tsx"
import { ContactPage } from "./SimplePages/ContactPage.tsx"
import { PrivacyPolicyPage } from "./SimplePages/PrivacyPolicyPage.tsx"
import { TermsOfServicePage } from "./SimplePages/TermsOfServicePage.tsx"
import { Layout } from "./_CommonComponents/Layout.tsx"
import { AppContextProvider } from "../AppContext.tsx"

import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/", element: <Layout/>, children: [
      { path: "/", element: <LandingPage /> },
      { path: "home", element: <HomePage /> },
      { path: "spotify-callback", element: <HomePage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "compose", element: <ComposePage /> },
      { path: "compose/preview", element: <PreviewPostPage /> },
      { path: "compose/:postId", element: <ComposePage /> },
      { path: "publish/:postId", element: <PublishPage /> },
      { path: "dashboard", element: <MyPostsPage />},
      { path: "settings", element: <AccountPage />},
      { path: "settings/subscriptions", element: <SubscriptionsPage />},
      { path: "contact", element: <ContactPage /> },
      { path: "tos", element: <TermsOfServicePage /> },
      { path: "privacy", element: <PrivacyPolicyPage /> },
      { path: ":atUsername/:slug", element: <PostPage /> },
      { path: ":atTag", element: <AtTagPage /> }
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
