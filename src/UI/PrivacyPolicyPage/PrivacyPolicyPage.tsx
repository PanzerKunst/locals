
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./PrivacyPolicyPage.scss"

export function PrivacyPolicyPage() {
  return (
    <div className="page privacy-policy">
      <main className="container">
        <FadeIn>
          <h1>We are commited to protecting your privacy</h1>
        </FadeIn>
        <FadeIn>
          <p>We use cookies and similar tracking technology to help us how you use our website. This information is anonymous.</p>
        </FadeIn>
      </main>
    </div>
  )
}
