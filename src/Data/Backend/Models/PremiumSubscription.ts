import { Currency } from "./Currency.ts"

export type NewPremiumSubscription = {
  userId: number,
  email: string,
  stripePaymentMethodId: string,
  currency: Currency,
}

export type PremiumSubscription = NewPremiumSubscription & {
  id: number,
  createdAt: string,
  updatedAt: string,
}
