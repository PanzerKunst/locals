import { FadeIn } from "./_CommonComponents/FadeIn.tsx"

export function ContactPage() {
  return (
    <div className="page simple contact">
      <main className="container">
        <FadeIn>
          <h1>Contact us!</h1>
        </FadeIn>
        <FadeIn>
          <p>We&apos;re always eager to hear from you! Your feedback helps us improve the Backstage Pass platform, ensuring we&apos;re always hitting
            the right note. Don&apos;t hesitate to drop us a line at <span className="underline disappears">hello@backstagepass.com</span>.</p>
        </FadeIn>
        <FadeIn>
          <p>Whether it&apos;s a rave review or a constructive critique, we&apos;re all ears and ready to listen. Let&apos;s make Backstage Pass the
            best it can be, together!</p>
        </FadeIn>
      </main>
    </div>
  )
}
