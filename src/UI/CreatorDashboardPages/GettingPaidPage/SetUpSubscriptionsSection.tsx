import classNames from "classnames"
import { useState } from "react"

import { ButtonLoader } from "../../_CommonComponents/ButtonLoader.tsx"

export function SetUpSubscriptionsSection() {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const handleFormSubmit = () => {
    setIsSubmittingForm(true)
  }

  return (
    <section>
      <h2>Set up your Premium plans</h2>

      <p>Monthly premium subscription</p>

      <p>Annual premium subscription</p>

      <button
        className={classNames("button filled", { loading: isSubmittingForm })}
        onClick={handleFormSubmit}
        disabled={isSubmittingForm}
      >
        {isSubmittingForm && <ButtonLoader/>}
        <span>Create Subscriptions</span>
      </button>
    </section>
  )
}
