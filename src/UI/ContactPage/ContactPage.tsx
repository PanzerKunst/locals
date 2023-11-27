import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./PrivacyPolicyPage.scss"

export function ContactPage() {
  return (
    <div className="page simple contact">
      <main className="container">
        <FadeIn>
          <h1>Contact us!</h1>
        </FadeIn>
        <FadeIn>
          <p>We employ cookies and similar tracking technology to ensure the smooth functioning of our website. Some of these cookies are necessary
            for the site to function. These are the good kind of cookies, ones that keep everything running smoothly for you.</p>
        </FadeIn>
        <FadeIn>
          <p>In addition to essential cookies, we also use analytics cookies, such as Google Analytics. These are used to understand how you use the
            site: to see what works, what doesn’t, and how we can improve your experience. The best part? All of this data is anonymous. We don’t know
            who you are, just how you interact with our site. And remember, these analytics cookies won&apos;t be collected if you decline them in the
            cookie popup on your first visit. You are in control.</p>
        </FadeIn>
      </main>
    </div>
  )
}
