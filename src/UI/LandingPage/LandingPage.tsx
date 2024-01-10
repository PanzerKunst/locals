import { useEffect } from "react"
import { Link } from "react-router-dom"

import { LandingPageHero } from "./LandingPageHero.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../Util/BrowserUtils.ts"
import { savePostWithTagsInSession } from "../../Util/SessionStorage.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { ErrorSnackbar } from "../_CommonComponents/Snackbar/ErrorSnackbar.tsx"

import "./LandingPage.scss"

export function LandingPage() {
  const { setSpotifyApiAccessToken, setSpotifyApiRefreshToken, setLoggedInUser } = useAppContext()
  const actionFromUrl = getUrlQueryParam(appUrlQueryParam.ACTION)

  useEffect(() => {
    if (actionFromUrl === actionsFromAppUrl.SIGN_OUT) {
      savePostWithTagsInSession(undefined)

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

      <section id="intro">
        <div className="container">
          <FadeIn>
            <h2>
              <p>Create high quality content for your audience.</p>
              <p>Get paid for it.</p>
            </h2>
          </FadeIn>

          {/* <FadeIn>
            <p>Music fans access premium content from all their favourite artists for $9.99 a month.</p>
          </FadeIn>

          <FadeIn>
            <p>90% of the revenue goes to content creators.</p>
          </FadeIn> */}

          <FadeIn>
            <p>Behind your music and live performances are some great stories. Stories that your fans would pay to access.</p>
          </FadeIn>

          <FadeIn>
            <p>We provide the tools and process for you to make it happen!</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button lg"><span>Let&apos;s go!</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section id="how-it-works">
        <div className="container">
          <FadeIn>
            <h2>How it works</h2>
          </FadeIn>

          <FadeIn>
            <p>1. Register via a Spotify account, just like everyone.</p>
          </FadeIn>

          <FadeIn>
            <p>2. Complete the <Link to="/" className="underlined disappears">artist verification & registration process</Link>.</p>
          </FadeIn>

          <FadeIn>
            <p>3. Members who listen to your music on Spotify are subscribed to your content automatically.</p>
          </FadeIn>

          <FadeIn>
            <p>4. Go paid by connecting to Stripe, it takes 5 minutes.</p>
          </FadeIn>

          <FadeIn>
            <p>5. Create content: accessible to everyone or exclusive to premium members - you decide.</p>
          </FadeIn>

          <FadeIn>
            <p>6. Fans access premium content from all their favourite artists for $9.99 a month. Keep 90% of the revenue.</p>
          </FadeIn>

          {/* <p>It is for you if:
            - You feel motivated to engage with your audience online. Via blogging, sharing images or videos, chatting, or streaming.
          </p>

          <p>It is not for you if:
            - You believe your music and live performances are enough ways to engage with your audience
          </p> */}

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button lg"><span>Get started</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      <section id="everyone-earns">
        <div className="container">
          <FadeIn>
            <h2>Everyone can earn from their content</h2>
          </FadeIn>

          <FadeIn>
            <p>Everyone can create premium content on their favourite music and artists, and get paid for it.</p>
          </FadeIn>

          <FadeIn>
            <p>90% of the site revenue goes to content creators.</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button lg"><span>Get started</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
