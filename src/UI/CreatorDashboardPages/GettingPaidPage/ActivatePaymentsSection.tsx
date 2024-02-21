import classNames from "classnames"
import { useState } from "react"

import { fetchStripeConnectUrl } from "../../../Data/Backend/Apis/PaymentApi.ts"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"

export function ActivatePaymentsSection() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const handleFormSubmit = async () => {
    setIsSubmittingForm(true)

    const stripeConnectUrl = await fetchStripeConnectUrl()
    window.location.assign(stripeConnectUrl)
  }

  return (
    <section>
      <h2>Activate payments</h2>

      <p>Setting up Stripe takes about 5 minutes. This is how money from premium subscribers gets into your bank account.</p>

      <p>Note that Stripe may show your business phone number and address on subscriber invoices unless hidden.</p>

      <button
        className={classNames("button filled rounded stripe", { loading: isSubmittingForm })}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleFormSubmit}
        disabled={isSubmittingForm}
      >
        {isSubmittingForm && <ButtonLoader/>}
        <span>Connect with Stripe</span>
      </button>
    </section>
  )
}
