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

      <section id="#for-artists">
        <div className="container">
          <FadeIn>
            <h2>For artists</h2>
          </FadeIn>

          <FadeIn>
            <p>Is your primary audience on Spotify?</p>

            <p>Social media leads to short form, superficial content, read in a few seconds before being scrolled away. This system prevents artists
              from providing us with high quality, deeper content.</p>

            <p>We listen to a massive variety of artists over time. Manually following every one of them on social media isn&apos;t sustainable.</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Register for Free</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section id="#for-fans">
        <div className="container">
          <FadeIn>
            <h2>For fans</h2>
          </FadeIn>

          <FadeIn>
            <p>Is your primary audience on Spotify?</p>

            <p>Social media leads to short form, superficial content, read in a few seconds before being scrolled away. This system prevents artists
              from providing us with high quality, deeper content.</p>

            <p>We listen to a massive variety of artists over time. Manually following every one of them on social media isn&apos;t sustainable.</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Register for Free</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
