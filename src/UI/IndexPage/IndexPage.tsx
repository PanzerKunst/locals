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

      <section id="for-artists">
        <div className="container">
          <FadeIn className="centered-contents">
            <h2>For artists</h2>
          </FadeIn>

          <FadeIn>
            <p>Is your primary audience on Spotify?</p>
          </FadeIn>

          <FadeIn>
            <p>Your audience is longing to discover the personalities who made these amazing tracks, yet reaching them is difficult.</p>
          </FadeIn>

          <FadeIn>
            <p>Social media leads to short form content, read in a few seconds before being scrolled away. It prevents you from
              providing your fans with high quality, deeper content.</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Join for Free</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section id="for-fans">
        <div className="container">
          <FadeIn className="centered-contents">
            <h2>For fans</h2>
          </FadeIn>

          <FadeIn>
            <p>Our music taste evolves over time, as we constantly discover new music… on Spotify. Backstage Pass leverages your Spotify data to
              follow you on your listening adventures.</p>
          </FadeIn>

          <FadeIn>
            <p>We listen to a massive variety of artists over time. Manually following every one of them on social media is less than ideal.</p>
          </FadeIn>

          <FadeIn>
            <p>Join the community to create a deeper connection with the artists who create the soundtrack to your daily life!</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Join for Free</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
