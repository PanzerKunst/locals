import { Checkbox, FormControl, Radio, RadioGroup } from "@mui/joy"
import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { useHeaderTitle } from "./_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { useAppContext } from "../AppContext.tsx"
import { changePostPublicationStatus, fetchPostOfId } from "../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../Data/Backend/BackendUtils.ts"
import { appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { isOnlyDigitsAndNotEmpty } from "../Util/ValidationUtils.ts"

import "./PublishPage.scss"

export function PublishPage() {
  const navigate = useNavigate()
  const { postId } = useParams()

  const loggedInUser = useAppContext().loggedInUser?.user
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  useHeaderTitle("Ready to publish?")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])


  const postQuery = useQuery(
    "post",
    () => fetchPostOfId(parseInt(postId!)), {
      enabled: isOnlyDigitsAndNotEmpty(postId)
    }
  )

  if (!isOnlyDigitsAndNotEmpty(postId)) {
    return renderContents(<span className="error">Invalid url</span>)
  }

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span className="error">Error fetching data</span>)
  }

  const { post } = postQuery.data!

  const handleFormSubmit = async () => {
    setIsSubmittingForm(true)
    const postWithSlugAndAuthor = await changePostPublicationStatus(post, true)
    navigate(getPostPath(postWithSlugAndAuthor))
  }

  return renderContents(
    <>
      <FadeIn className="section-wrapper">
        <section className="bordered">
          <FormControl id="post-visibility">
            <h2>This post is for</h2>
            <RadioGroup defaultValue="public" name="radio-buttons-group">
              <Radio value="public" label="Everyone" variant="soft" />
              <Radio
                value="premium"
                label="Premium subscribers only"
                variant="soft"
                disabled
              />
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
