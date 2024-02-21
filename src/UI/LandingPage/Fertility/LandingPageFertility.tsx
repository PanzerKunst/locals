import { Link } from "react-router-dom"

import { LandingPageHeroFertility } from "./LandingPageHeroFertility.tsx"
import { AnimatedButton } from "../../_CommonComponents/AnimatedButton.tsx"
import { FadeIn } from "../../_CommonComponents/FadeIn.tsx"

import "./LandingPageFertility.scss"

export function LandingPageFertility() {
  return (
    <div className="page landing">
      <main>
        <LandingPageHeroFertility/>

        <section id="intro">
          <div className="container">
            <FadeIn>
              <h2>
                <p>Create high quality content for your audience.</p>
                <p>Get paid for it.</p>
              </h2>
            </FadeIn>

            <FadeIn>
              <p>Behind your music and touring are some great stories. Stories that your fans would pay to access.</p>
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
              <p>2. Complete the artist verification process.</p>
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
      </main>
    </div>
  )
}
