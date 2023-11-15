import { BrowserRouter, Route, Routes } from "react-router-dom"

import { HomePage } from "./HomePage/HomePage.tsx"
import { IndexPage } from "./IndexPage/IndexPage.tsx"
import { AppFooter } from "./_CommonComponents/AppFooter.tsx"
import { AppHeader } from "./_CommonComponents/AppHeader/AppHeader.tsx"
import { AppContextProvider } from "../AppContext.tsx"

import "./App.scss"

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <AppHeader/>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/spotify-callback" element={<HomePage/>}/>
        </Routes>
        <AppFooter/>
      </BrowserRouter>
    </AppContextProvider>
  )
}
