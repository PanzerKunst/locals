import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/joy"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import classNames from "classnames"
import { useState } from "react"

import { useAppContext } from "../../../AppContext.tsx"
import { subscribeToPremium } from "../../../Data/Backend/Apis/PremiumSubscriptionApi.ts"
import { Currency } from "../../../Data/Backend/Models/Currency.ts"
import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"
import { ErrorSnackbar } from "../../_CommonComponents/Snackbar/ErrorSnackbar.tsx"
import { stripeCardElementStyle } from "../../_CommonComponents/StripeCardElementStyle.ts"


import "./PremiumMembershipSection.scss"

export function PremiumMembershipSection() {
  const loggedInUser = useAppContext().loggedInUser?.user
  const stripe = useStripe()
  const elements = useElements()

  const [isPaymentDisplayed, setIsPaymentDisplayed] = useState(false)
  const [currency, setCurrency] = useState<Currency>(Currency.USD)
  const [paymentError, setPaymentError] = useState<string>("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const handleFormSubmit = async () => {
    const cardElement = elements?.getElement(CardElement)

    if (!loggedInUser || !stripe || !cardElement) {
      return
    }

    setIsSubmittingForm(true)

    const { email } = loggedInUser

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { email }
    })

    if (error) {
      setPaymentError(error.message || "")
      return
    }

    if (!paymentMethod) {
      setPaymentError("Undefined payment method")
      return
    }

    await subscribeToPremium(loggedInUser, email, paymentMethod.id, currency)

    setIsPaymentDisplayed(false)
    setIsSubmittingForm(false)
  }

  return (
    <section className="bordered premium-membership">
      {paymentError !== "" && <ErrorSnackbar message={`Stripe payment error: "${paymentError}"`}/>}
      <h2>Premium Membership</h2>

      {isPaymentDisplayed ? (
        <>
          <FormControl id="currency">
            <RadioGroup value={currency.toString()} onChange={(event) => setCurrency(event.target.value as Currency)}>
              <Radio value={Currency.USD.toString()} label="$9.99 monthly recurring" variant="soft"/>
              <Radio value={Currency.EUR.toString()} label="9.99€ monthly recurring" variant="soft"/>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Card details</FormLabel>
            <CardElement options={{ style: stripeCardElementStyle }} />
          </FormControl>

          <div className="button-wrapper">
            <button
              className={classNames("button filled", { loading: isSubmittingForm })}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleFormSubmit}
              disabled={isSubmittingForm || !stripe || !elements}
            >
              {isSubmittingForm && <ButtonLoader/>}
              <span>Pay</span>
            </button>
            <button className="button filled transparent" onClick={() => setIsPaymentDisplayed(false)}>
              <span>Cancel</span>
            </button>
          </div>
        </>
      ) : (
        <div className="button-wrapper">
          <button className="button filled" onClick={() => setIsPaymentDisplayed(true)}>
            <span>Upgrade to Premium<br/>for $9.99 / month</span>
          </button>
        </div>
      )}
    </section>
  )
}
