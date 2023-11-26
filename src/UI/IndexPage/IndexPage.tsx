import { Tab, TabList, TabPanel, Tabs } from "@mui/joy"
import { useEffect } from "react"
import { Link } from "react-router-dom"

import { IndexPageHero } from "./IndexPageHero.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"

import "./IndexPage.scss"

export function IndexPage() {
  const { setSpotifyApiAccessToken, setSpotifyApiRefreshToken, setLoggedInUser } = useAppContext()
  const actionFromUrl = getUrlQueryParam(appUrlQueryParam.ACTION)

  useEffect(() => {
    if (actionFromUrl === actionsFromAppUrl.SIGN_OUT) {
      setSpotifyApiAccessToken(undefined)
      setSpotifyApiRefreshToken(undefined)
      setLoggedInUser(undefined)
    }
  }, [actionFromUrl, setLoggedInUser, setSpotifyApiAccessToken, setSpotifyApiRefreshToken])

  const spotifyCallbackErrorFromUrl = getUrlQueryParam(appUrlQueryParam.SPOTIFY_CALLBACK_ERROR)

  return (
    <div className="page index">
      {spotifyCallbackErrorFromUrl && <ErrorSnackbar message={`Spotify API error: "${spotifyCallbackErrorFromUrl}"`}/>}

      <IndexPageHero/>

      <section className="container">
        <Tabs size="lg" aria-label="Basic tabs" defaultValue={0}>
          <TabList disableUnderline tabFlex={1}>
            <Tab>For artists</Tab>
            <Tab>For fans</Tab>
          </TabList>

          <TabPanel value={0}>
            <FadeIn>
              <p>Is your primary audience on Spotify?</p>
            </FadeIn>

            <FadeIn className="centered-contents">
              <AnimatedButton className="filling">
                <Link to="/home" className="button"><span>Register for Free</span></Link>
              </AnimatedButton>
            </FadeIn>
          </TabPanel>
          <TabPanel value={1}>
            <b>Second</b> tab panel
          </TabPanel>
        </Tabs>
      </section>
    </div>
  )
}
