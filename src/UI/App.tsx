import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AtTagPage } from "./AtTagPage.tsx"
import { ComposePage } from "./ComposePage.tsx"
import { ContactPage } from "./ContactPage.tsx"
import { MyPostsPage } from "./Dashboard/MyPostsPage.tsx"
import { SettingsPage } from "./Dashboard/SettingsPage/SettingsPage.tsx"
import { HomePage } from "./HomePage/HomePage.tsx"
import { LandingPage } from "./LandingPage/LandingPage.tsx"
import { PostPage } from "./PostPage.tsx"
import { PreviewPostPage } from "./PreviewPostPage.tsx"
import { PrivacyPolicyPage } from "./PrivacyPolicyPage.tsx"
import { PublishPage } from "./PublishPage.tsx"
import { RegisterPage } from "./RegisterPage/RegisterPage.tsx"
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
      { path: "posts", element: <MyPostsPage />},
      { path: "settings", element: <SettingsPage />},
      { path: "contact", element: <ContactPage /> },
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
