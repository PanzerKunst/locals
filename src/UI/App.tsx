import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomePage from "./HomePage/HomePage.tsx"
import IndexPage from "./IndexPage/IndexPage.tsx"

import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage/>,
  },
  {
    path: "/home",
    element: <HomePage/>,
  },
  {
    path: "/spotify-callback",
    element: <HomePage/>,
  }
])

export default function App() {
  return <RouterProvider router={router}/>
}
