import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

export function PrivacyPolicyPage() {
  return (
    <div className="page simple privacy-policy">
      <main className="container">
        <FadeIn>
          <h1>Privacy Policy</h1>
        </FadeIn>

        <FadeIn>
          <h2>Spotify data</h2>
        </FadeIn>
        <FadeIn>
          <p>Registration and login to the platform is done via your Spotify account, enabling the platform to know your musical interests and deliver
            content relevant to you specifically. The platform periodically accesses your Spotify user data to keep that content relevant over
            time.</p>
        </FadeIn>

        <FadeIn>
          <h2>Email</h2>
        </FadeIn>
        <FadeIn>
          <p>We need your email address for essential communication regarding the platform, such as notifying you of updates to our terms of use,
            upcoming changes to subscription costs, and other important service-related information.</p>
        </FadeIn>
        <FadeIn>
          <p>Your email is also used to receive new posts of subscribed artists and other authors directly in your inbox. This communication is
            opt-in and configurable in your account settings.</p>
        </FadeIn>

        <FadeIn>
          <h2>Cookies</h2>
        </FadeIn>
        <FadeIn>
          <p>The platform employs cookies and similar tracking technology. Some of these cookies are necessary for the site to function, the rest are
            for analytics. Analytics data is anonymous, and will not be collected if you decline those cookies in the popup on your first visit.</p>
        </FadeIn>
        <FadeIn>
          <p>Finally, none of your data is shared with third parties.</p>
        </FadeIn>
      </main>
    </div>
  )
}
