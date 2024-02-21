import classNames from "classnames"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { ActivatePaymentsSection } from "./ActivatePaymentsSection.tsx"
import { SetUpSubscriptionsSection } from "./SetUpSubscriptionsSection.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { AppUrlQueryParam, EventsFromAppUrl } from "../../../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../../../Util/BrowserUtils.ts"
import { useHeaderTitle } from "../../_CommonComponents/AppHeader/AppHeader.ts"
import { useSidebarNav } from "../../_CommonComponents/SidebarNav.ts"
import { DashboardSidebar } from "../DashboardSidebar.tsx"

export function GettingPaidPage() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user
  const { isSidebarHidden, isSidebarHideable } = useSidebarNav()

  const [stripeAccountId, setStripeAccountId] = useState<string>()

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Creator Dashboard" : "Getting Paid")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const eventFromUrl = getUrlQueryParam(AppUrlQueryParam.EVENT)

  useEffect(() => {
    if (eventFromUrl === EventsFromAppUrl.STRIPE_ONBOARDING_SUCCESS) {
      /* TODO: fetch Stripe account ID, just to make sure it's there.
      If it is, display details for creating a subscription. */

      setStripeAccountId("")
    }
  }, [eventFromUrl])

  return (
    <div className={classNames("page with-sidebar dashboard getting-paid", { "sidebar-hidden": isSidebarHideable && isSidebarHidden })}>
      <DashboardSidebar />
      <main className="container">
        {stripeAccountId ? <SetUpSubscriptionsSection/> : <ActivatePaymentsSection/>}
      </main>
    </div>
  )
}
