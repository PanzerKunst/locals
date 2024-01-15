import dayjs from "dayjs"
import _isEqual from "lodash/isEqual"
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"

import { UserWithFollowedArtistsAndAuthors } from "./Data/Backend/Models/UserWithFollowedArtistsAndAuthors.ts"
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
  loggedInUser?: UserWithFollowedArtistsAndAuthors;
  setLoggedInUser: (userWithFollowedArtistsAndAuthors: UserWithFollowedArtistsAndAuthors | undefined) => void; // eslint-disable-line no-unused-vars
  headerTitle?: string;
  setHeaderTitle: (title: string | undefined) => void; // eslint-disable-line no-unused-vars
}

const AppContext = createContext<AppContextType>({
  setSpotifyApiVerifier: () => {},
  setSpotifyApiAccessToken: () => {},
  setSpotifyApiRefreshToken: () => {},
  setLoggedInUser: () => {},
  setHeaderTitle: () => {}
})

type Props = {
  children: ReactNode;
}

export function AppContextProvider({ children }: Props) {
  const [spotifyApiVerifier, setSpotifyApiVerifier] = useState(getSpotifyApiVerifierFromLocalStorage())
  const [spotifyApiAccessToken, setSpotifyApiAccessToken] = useState(getSpotifyApiAccessTokenFromLocalStorage())
  const [spotifyApiRefreshToken, setSpotifyApiRefreshToken] = useState(getSpotifyApiRefreshTokenFromLocalStorage())
  const [spotifyApiTokenExpirationDate, setSpotifyApiTokenExpirationDateState] = useState(getSpotifyApiTokenExpirationDateFromLocalStorage())
  const [loggedInUser, setLoggedInUserState] = useState(getLoggedInUserFromLocalStorage())
  const [headerTitle, setHeaderTitle] = useState<string>()

  // Any context variable which isn't of a primitive type (string, number, boolean) should be wrapped in a useCallback to avoid infinite loops

  const setSpotifyApiTokenExpirationDate = useCallback((date: Date) => {
    if (!dayjs(spotifyApiTokenExpirationDate).isSame(dayjs(date), "second")) {
      setSpotifyApiTokenExpirationDateState(date)
    }
  }, [spotifyApiTokenExpirationDate])

  const setLoggedInUser = useCallback((userWithFollowedArtistsAndAuthors: UserWithFollowedArtistsAndAuthors | undefined) => {
    if (!_isEqual(loggedInUser, userWithFollowedArtistsAndAuthors)) {
      setLoggedInUserState(userWithFollowedArtistsAndAuthors)
    }
  }, [loggedInUser])

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

    setLoggedInUser: (userWithFollowedArtistsAndAuthors: UserWithFollowedArtistsAndAuthors | undefined) => {
      saveLoggedInUserInLocalStorage(userWithFollowedArtistsAndAuthors)
      setLoggedInUser(userWithFollowedArtistsAndAuthors)
    },

    headerTitle,
    setHeaderTitle
  }), [
    headerTitle,
    loggedInUser,
    setLoggedInUser,
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
