import { Link } from "react-router-dom"

import { IndexPageHero } from "./IndexPageHero.tsx"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./IndexPage.scss"

export function IndexPage() {
  return (
    <div id="index-page">
      <IndexPageHero/>

      <section id="the-problem">
        <div className="container">
          <FadeIn>
            <h2>The problem</h2>
          </FadeIn>

          <FadeIn>
            <p>Our favourite artists come to play where we live, but we miss them because that info is lost in the noise.</p>

            <p>Social media leads to short form, superficial content, read in a few seconds before being scrolled away. This system prevents artists
              from providing us with high quality, deeper content.</p>

            <p>We listen to a massive variety of artists over time. Manually following every one of them on social media isn&apos;t sustainable.</p>
          </FadeIn>
        </div>
      </section>

      <section id="the-solution">
        <div className="container">
          <FadeIn>
            <h2>The solution</h2>
          </FadeIn>

          <FadeIn>
            <p>Our music taste evolves over time, as we constantly discover new music… on Spotify. FanLink leverages your Spotify data to follow you
              on your listening adventures.</p>

            <p>The platform delivers high quality, long form content from your favourite artists, that is <strong>relevant to you</strong>.</p>

            <p>It&apos;s about creating a deeper connection with the artists who create the soundtrack to your daily life.</p>
          </FadeIn>

          <FadeIn className="centered-contents">
            <AnimatedButton className="filling">
              <Link to="/home" className="button"><span>Get started</span></Link>
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
