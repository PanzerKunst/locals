import { useEffect } from "react"
import { Link } from "react-router-dom"

import { LandingPageHero } from "./LandingPageHero.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"

import "./LandingPage.scss"

export function LandingPage() {
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
    <div className="page landing">
      {spotifyCallbackErrorFromUrl && <ErrorSnackbar message={`Spotify API error: "${spotifyCallbackErrorFromUrl}"`}/>}

      <LandingPageHero/>

      <section id="for-artists">
        <div className="container">
          <FadeIn className="centered-contents">
            <h2>How it works</h2>
          </FadeIn>

          <FadeIn>
            <p>1. Sign in with your Spotify account.</p>
          </FadeIn>

          <FadeIn>
            <p>2. Select which of you favourite @artists to follow.</p>
          </FadeIn>

          <FadeIn>
            <p>3. Select which if your favourite #genres to follow.</p>
          </FadeIn>

          <FadeIn>
            <p>4. Confirm your account details.</p>
          </FadeIn>

          <FadeIn>
            <p>5. You&apos;re set! 🎉 Write and share content about your favourite music!</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Let&apos;s go!</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section id="for-fans">
        <div className="container">
          <FadeIn className="centered-contents">
            <h2>How it works - for artists</h2>
          </FadeIn>

          <p>1. Register with your private Spotify account.</p>

          <p>2. Complete the <Link to="/" className="underlined disappears">artist representation process</Link>.</p>

          <p>3. Start sharing your artist journey by publishing to your <em>followers</em>. They are longing for a real, authentic connection!</p>

          <p>4. Add some premium content. Premium content is only made available to your <em>subscribers</em>. Subscribers are your biggest fans:
            they support you financially through a monthly payment.</p>

          <p>You always own your content and your mailing list. Build a community. Keep 90% of the revenue from subscribers.</p>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Join the Community</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
