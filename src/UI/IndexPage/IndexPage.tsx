import { Link } from "react-router-dom"

import { ScrollToVisible } from "../_CommonComponents/ScrollToVisible.tsx"

import "./IndexPage.scss"

export default function IndexPage() {
  return (
    <main id="index-page">
      <section id="hero">
        <div className="bottom-triangle"/>
      </section>

      <section id="the-problem">
        <div className="container">
          <ScrollToVisible>
            <h2>The problem</h2>
          </ScrollToVisible>

          <ScrollToVisible>
            <p>Our favourite artists come to play where we live, but we miss them because that info is lost in the noise.</p>

            <p>Social media leads to short form, superficial content, read in a few seconds before being scrolled away. This system prevents artists
              from providing us with high quality, deeper content.</p>

            <p>We listen to a massive variety of artists over time. Manually following every one of them on social media isn&apos;t sustainable.</p>
          </ScrollToVisible>
        </div>
        <div className="bottom-triangle"/>
      </section>

      <section id="the-solution">
        <div className="container">
          <ScrollToVisible>
            <h2>The solution</h2>
          </ScrollToVisible>

          <ScrollToVisible>
            <p>Our music taste evolves over time, as we constantly discover new music… on Spotify. FanLink leverages your Spotify data to follow you
              on your listening adventures.</p>

            <p>The platform delivers high quality, long form content from your favourite artists, that is <strong>relevant to you</strong>.</p>

            <p>It&apos;s about creating a deeper connection with the artists who create the soundtrack to your daily life.</p>
          </ScrollToVisible>

          <ScrollToVisible className="centered-contents">
            <Link to="/home">Get started</Link>
          </ScrollToVisible>
        </div>
      </section>
    </main>
  )
}
