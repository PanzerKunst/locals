import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

import "./ContactPage.scss"

export function ContactPage() {
  return (
    <div className="page simple contact">
      <main className="container">
        <FadeIn>
          <h1>Contact us!</h1>
        </FadeIn>
        <FadeIn>
          <p>We&apos;re always eager to hear from you! Your feedback helps us improve the Get Backstage platform, ensuring we&apos;re always hitting
            the right note. Don&apos;t hesitate to drop us a line at <span className="underlined disappears">hello@getbackstage.net</span>.</p>
        </FadeIn>
        <FadeIn>
          <p>Whether it&apos;s a rave review or a constructive critique, we&apos;re all ears and ready to listen.</p>
        </FadeIn>

        <FadeIn>
          <h2>Company Information</h2>
        </FadeIn>
        <FadeIn className="company-info">
          <span>Get Backstage AB</span>
          <span>Heleneborgsgatan 6C</span>
          <span>117 32 Stockholm Sweden</span>
          <span>Company registration number: 556989-6466</span>
        </FadeIn>
      </main>
    </div>
  )
}
