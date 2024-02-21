import { config } from "../../../config.ts"
import { Currency } from "../Models/Currency.ts"
import { NewPremiumSubscription } from "../Models/PremiumSubscription.ts"
import { User } from "../Models/User.ts"

export async function subscribeToPremium(user: User, purchaseEmail: string, stripePaymentMethodId: string, currency: Currency) {
  const newPremiumSubscription: NewPremiumSubscription = {
    userId: user.id,
    email: purchaseEmail,
    stripePaymentMethodId,
    currency
  }

  const result = await fetch(`${config.BACKEND_URL}/premium-subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ premiumSubscription: newPremiumSubscription })
  })

  if (!result.ok) {
    throw new Error(`Error while processing premium subscription ${JSON.stringify(newPremiumSubscription)}`)
  }
}

export async function fetchStripeConnectUrl() {
  const result = await fetch(`${config.BACKEND_URL}/stripe-connect-url`, { method: "GET" })

  if (!result.ok) {
    throw new Error("Error while fetching Stripe Connect URL")
  }

  return await result.text()
}
