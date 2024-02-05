import { Link } from "react-router-dom"

import { FadeIn } from "../_CommonComponents/FadeIn.tsx"

export function TermsOfServicePage() {
  return (
    <div className="page simple terms-of-service">
      <main className="container">
        <FadeIn>
          <h1>Terms of Service</h1>
        </FadeIn>

        <FadeIn>
          <p>Get Backstage (“the platform”) enables its users (“you”) to create and consume content about the music and artists they love.</p>
        </FadeIn>
        <FadeIn>
          <p>Content Creators (“authors”) write posts (text and/or media), choosing upon publication to make the posts either visible to all users
            (public) or limited to premium users. Users get access to premium content through a monthly payment, granting them a Premium Membership.
            The platform’s revenue comes exclusively from Premium Memberships, and 90% of that revenue is redistributed to authors whose premium posts
            are consumed.</p>
        </FadeIn>
        <FadeIn>
          <p>Users representing an artist can complete a verification procedure, enabling them to become a Verified Artist. Verified Artists have a
            Premium Membership for free.</p>
        </FadeIn>

        <FadeIn>
          <h2>Privacy Policy</h2>
        </FadeIn>
        <FadeIn>
          <p>By registering to the Get Backstage platform, you have read and agree to its <Link to="/privacy"
            className="underlined disappears">Privacy
            Policy</Link>.</p>
        </FadeIn>

        <FadeIn>
          <h2>User Responsibilities</h2>
        </FadeIn>
        <FadeIn>
          <p>The Get Backstage platform must not be used to post content that (a) is illegal, obscene, sexually explicit, deceptive or fraudulent; (b)
            could be considered offensive, defamatory, malicious, or discriminatory in any way, including on the basis of race, disability, sex,
            sexual orientation, or religion; or (c) involves the distribution of spam, malicious software, or other harmful material.</p>
        </FadeIn>

        <FadeIn>
          <h2>Intellectual Property Rights</h2>
        </FadeIn>
        <FadeIn>
          <p>Authors are solely responsible for ensuring that any content they post is original and created by them, or that they
            have obtained all necessary rights and permissions to use and republish the content. By submitting content to the platform, authors
            warrant that their content does not infringe on any third party&apos;s intellectual property rights or violate any applicable laws or
            regulations.</p>
        </FadeIn>
        <FadeIn>
          <p>All content posted on Get Backstage remains the intellectual property of its author. These authors retain full ownership rights to their
            content. The use, reproduction, modification, or distribution of any content outside of Get Backstage is strictly prohibited without the
            express written consent of the content&apos;s owner. By using this platform, users agree to respect the copyright and ownership rights of
            all authors.</p>
        </FadeIn>

        <FadeIn>
          <h2>Payment Terms</h2>
        </FadeIn>
        <FadeIn>
          <p>Two types of financial transactions are involved:</p>
          <ul>
            <li>Users doing a monthly recurring payment for a Premium Membership</li>
            <li>The Get Backstage platform paying monthly to authors whose premium posts are consumed</li>
          </ul>
        </FadeIn>
        <FadeIn>
          <p>All transactions are done via the Stripe payment processor. Any change in the cost of a Premium Membership will be communicated by email
            at least 60 days ahead of time.</p>
        </FadeIn>
        <FadeIn>
          <p>Users can cancel their premium membership at any time under their account settings. Please note that refunds are not available once the
            payment for premium membership has been processed for the current period. The premium membership remains active and accessible until the
            end of the period.</p>
        </FadeIn>
        <FadeIn>
          <p>Authors receiving payments are responsible</p>
        </FadeIn>

        <FadeIn>
          <h2>Account Termination/Suspension</h2>
        </FadeIn>
        <FadeIn>
          <p>Users can delete their account by themselves at any time. Any related premium membership is automatically cancelled in the process.</p>
        </FadeIn>
        <FadeIn>
          <p>The platform administrators reserve the right to suspend or terminate a user&apos;s account if they are found to be in violation of the
            terms of service, specifically under sections “User Responsibilities” and “Intellectual Property Rights”.</p>
        </FadeIn>

        <FadeIn>
          <h2>Disclaimers and Limitations of Liability</h2>
        </FadeIn>
        <FadeIn>
          <p>Users are solely responsible for their posted content. Any user can report content they believe to be inappropriate. Upon receiving such
            reports, our administrators will review the flagged content and take appropriate action, which may include removing the content and
            suspending the user account if the content is found to be in violation of our policies and rules. However, our role in monitoring and
            enforcing content standards does not make us liable for user-generated content.</p>
        </FadeIn>
        <FadeIn>
          <p>Users agree to indemnify and hold harmless Get Backstage and its employees from any claim, including reasonable attorney&apos;s fees,
            made by any third party arising out of your use of the platform, your violation of these terms of service, or your violation of any rights
            of another.</p>
        </FadeIn>

        <FadeIn>
          <h2>Amendments</h2>
        </FadeIn>
        <FadeIn>
          <p>We reserve the right to modify or amend these terms to reflect changes in our services, practices, or relevant laws and regulations.
            Any amendments will be effective immediately upon posting the updated terms on the Get Backstage platform. Users will be notified of
            any significant changes via email.</p>
        </FadeIn>

        <FadeIn>
          <h2>Contact Information</h2>
        </FadeIn>
        <FadeIn>
          <p>Please refer to our <Link to="/contact" className="underlined disappears">Contact page</Link>.</p>
        </FadeIn>
      </main>
    </div>
  )
}
