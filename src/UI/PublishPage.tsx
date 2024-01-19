import { Checkbox, FormControl, Radio, RadioGroup } from "@mui/joy"
import classNames from "classnames"
import { ChangeEvent, ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { useHeaderTitle } from "./_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { useAppContext } from "../AppContext.tsx"
import { changePostPublicationSettings, fetchPostOfId } from "../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../Data/Backend/BackendUtils.ts"
import { AccessTier } from "../Data/Backend/Models/Post.ts"
import { AppUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { isOnlyDigitsAndNotEmpty } from "../Util/ValidationUtils.ts"

import "./PublishPage.scss"

export function PublishPage() {
  const navigate = useNavigate()
  const { postId } = useParams()

  const loggedInUser = useAppContext().loggedInUser?.user

  const [accessTier, setAccessTier] = useState<AccessTier>(AccessTier.PUBLIC)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  useHeaderTitle("Ready to publish?")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const postQuery = useQuery(
    "post",
    () => fetchPostOfId(parseInt(postId!)), {
      enabled: isOnlyDigitsAndNotEmpty(postId)
    }
  )

  useEffect(() => {
    if (!postQuery.data) {
      return
    }

    setAccessTier(postQuery.data.post.accessTier)
  }, [postQuery.data])

  if (!isOnlyDigitsAndNotEmpty(postId)) {
    return renderContents(<span className="danger">Invalid url</span>)
  }

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span className="danger">Error fetching data</span>)
  }

  const { post } = postQuery.data!

  const handleAccessTierChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccessTier(parseInt(event.target.value) as AccessTier)
  }

  const handleFormSubmit = async () => {
    setIsSubmittingForm(true)
    post.accessTier = accessTier
    const postWithSlugAndAuthor = await changePostPublicationSettings(post, true)
    navigate(getPostPath(postWithSlugAndAuthor))
  }

  return renderContents(
    <>
      <FadeIn className="section-wrapper">
        <section className="bordered">
          <FormControl id="access-tier">
            <h2>This post is for</h2>
            <RadioGroup value={accessTier.toString()} name="radio-buttons-group" onChange={handleAccessTierChange}>
              <Radio value={AccessTier.PUBLIC.toString()} label="Everyone" variant="soft" />
              <Radio value={AccessTier.PREMIUM.toString()} label="Premium subscribers only" variant="soft" />
            </RadioGroup>
          </FormControl>
        </section>
      </FadeIn>

      <FadeIn className="section-wrapper">
        <section className="bordered">
          <FormControl id="notifications">
            <h2>Notifications</h2>
            <Checkbox
              label="Send via e-mail to subscribers"
              variant="soft"
              color="primary"
              defaultChecked
            />
          </FormControl>
        </section>
      </FadeIn>

      <FadeIn className="action-buttons">
        <Link to={`/compose/${post.id}`} className="underlined disappears">Edit Post</Link>

        <AnimatedButton className="filling">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button className={classNames("button", { "filling loading": isSubmittingForm })} onClick={handleFormSubmit}>
            {isSubmittingForm && <ButtonLoader/>}
            <span>Publish</span>
          </button>
        </AnimatedButton>
      </FadeIn>
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page publish">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
