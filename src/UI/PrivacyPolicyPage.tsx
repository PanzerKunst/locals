import { useHeaderTitle } from "./_CommonComponents/AppHeader/AppHeader.ts"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"

export function PrivacyPolicyPage() {
  useHeaderTitle("Privacy Policy")

  return (
    <div className="page simple privacy-policy">
      <main className="container">
        <FadeIn>
          <h1>We are commited to protecting your privacy</h1>
        </FadeIn>
        <FadeIn>
          <p>We employ cookies and similar tracking technology to ensure the smooth functioning of our website. Some of these cookies are necessary
            for the site to function.</p>
        </FadeIn>
        <FadeIn>
          <p>In addition to essential cookies, we also use analytics cookies, such as Google Analytics. These are used to understand how you use the
            site: to see what works, what doesn’t, and how we can improve your experience. All of this data is anonymous. We don’t know who you are,
            just how you interact with our site. And remember, these analytics cookies won&apos;t be collected if you decline them in the cookie popup
            on your first visit. You are in control.</p>
        </FadeIn>
        <FadeIn>
          <p>Lastly, and most importantly, your data is not shared with third parties. Your trust is the backbone of our community, and we strive to
            maintain that trust by respecting your privacy. Your music preferences, site interactions, and personal data stay with us, and us
            alone.</p>
        </FadeIn>
      </main>
    </div>
  )
}
