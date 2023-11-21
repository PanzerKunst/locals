import dayjs from "dayjs"
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"

import { User } from "./Data/BackendModels/User.ts"
import {
  getLoggedInUserFromLocalStorage,
  getSpotifyApiAccessTokenFromLocalStorage,
  getSpotifyApiRefreshTokenFromLocalStorage,
  getSpotifyApiTokenExpirationDateFromLocalStorage,
  getSpotifyApiVerifierFromLocalStorage,
  saveLoggedInUserInLocalStorage,
  saveSpotifyApiAccessTokenInLocalStorage,
  saveSpotifyApiRefreshTokenInLocalStorage,
  saveSpotifyApiTokenExpirationDateInLocalStorage,
  saveSpotifyApiVerifierInLocalStorage
} from "./Util/LocalStorage.ts"

export type AppContextType = {
  spotifyApiVerifier?: string;
  setSpotifyApiVerifier: (verifier: string) => void; // eslint-disable-line no-unused-vars
  spotifyApiAccessToken?: string;
  setSpotifyApiAccessToken: (token: string | undefined) => void; // eslint-disable-line no-unused-vars
  spotifyApiRefreshToken?: string;
  setSpotifyApiRefreshToken: (token: string | undefined) => void; // eslint-disable-line no-unused-vars
  spotifyApiTokenExpirationDate?: Date;
  loggedInUser?: User;
  setLoggedInUser: (user: User | undefined) => void; // eslint-disable-line no-unused-vars
}

const AppContext = createContext<AppContextType>({
  setSpotifyApiVerifier: () => {},
  setSpotifyApiAccessToken: () => {},
  setSpotifyApiRefreshToken: () => {},
  setLoggedInUser: () => {}
})

type Props = {
  children: ReactNode;
}

export function AppContextProvider({ children }: Props) {
  const [spotifyApiVerifier, setSpotifyApiVerifier] = useState(getSpotifyApiVerifierFromLocalStorage())
  const [spotifyApiAccessToken, setSpotifyApiAccessToken] = useState(getSpotifyApiAccessTokenFromLocalStorage())
  const [spotifyApiRefreshToken, setSpotifyApiRefreshToken] = useState(getSpotifyApiRefreshTokenFromLocalStorage())
  const [spotifyApiTokenExpirationDate, setSpotifyApiTokenExpirationDateState] = useState(getSpotifyApiTokenExpirationDateFromLocalStorage())
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>(getLoggedInUserFromLocalStorage())

  const setSpotifyApiTokenExpirationDate = useCallback((date: Date) => {
    if (!dayjs(spotifyApiTokenExpirationDate).isSame(dayjs(date), "second")) {
      setSpotifyApiTokenExpirationDateState(date)
    }
  }, [spotifyApiTokenExpirationDate])

  const contextValue = useMemo(() => ({
    spotifyApiVerifier,

    setSpotifyApiVerifier: (verifier: string) => {
      saveSpotifyApiVerifierInLocalStorage(verifier)
      setSpotifyApiVerifier(verifier)
    },

    spotifyApiAccessToken,

    setSpotifyApiAccessToken: (token: string | undefined) => {
      saveSpotifyApiAccessTokenInLocalStorage(token)
      setSpotifyApiAccessToken(token)

      const now = dayjs()
      const inOneHour = now.add(1, "hour")

      // TODO: remove
      console.log("setSpotifyApiTokenExpirationDate", {
        now: now.toISOString(),
        inOneHour: inOneHour.toISOString()
      })

      saveSpotifyApiTokenExpirationDateInLocalStorage(inOneHour.toDate())
      setSpotifyApiTokenExpirationDate(inOneHour.toDate())
    },

    spotifyApiRefreshToken,

    setSpotifyApiRefreshToken: (token: string | undefined) => {
      saveSpotifyApiRefreshTokenInLocalStorage(token)
      setSpotifyApiRefreshToken(token)
    },

    spotifyApiTokenExpirationDate,

    loggedInUser,

    setLoggedInUser: (user: User | undefined) => {
      saveLoggedInUserInLocalStorage(user)
      setLoggedInUser(user)
    }
  }), [
    loggedInUser,
    setSpotifyApiTokenExpirationDate,
    spotifyApiAccessToken,
    spotifyApiRefreshToken,
    spotifyApiTokenExpirationDate,
    spotifyApiVerifier
  ])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext(): AppContextType {
  return useContext(AppContext)
}
