import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomePage from "./HomePage/HomePage.tsx"

import "./App.scss"

const router = createBrowserRouter([
  {
    path: "/",
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
