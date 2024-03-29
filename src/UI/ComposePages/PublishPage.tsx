import { Checkbox, FormControl, Radio, RadioGroup } from "@mui/joy"
import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { changePostPublicationSettings, fetchPostOfId } from "../../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../../Data/Backend/BackendUtils.ts"
import { AccessTier } from "../../Data/Backend/Models/Post.ts"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { isOnlyDigitsAndNotEmpty } from "../../Util/ValidationUtils.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"

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

  const handleFormSubmit = async () => {
    setIsSubmittingForm(true)
    post.accessTier = accessTier
    const postWithSlugAndAuthor = await changePostPublicationSettings(post, true)
    navigate(getPostPath(postWithSlugAndAuthor))
  }

  return renderContents(
    <>
      <section className="bordered">
        <h2>This post is for</h2>

        <FormControl id="access-tier">
          <RadioGroup value={accessTier.toString()} onChange={(event) => setAccessTier(parseInt(event.target.value) as AccessTier)}>
            <Radio value={AccessTier.PUBLIC.toString()} label="Everyone" variant="soft"/>
            <Radio value={AccessTier.PREMIUM.toString()} label="Premium subscribers only" variant="soft"/>
          </RadioGroup>
        </FormControl>
      </section>

      <section className="bordered">
        <h2>Notifications</h2>

        <FormControl id="notifications">
          <Checkbox
            label="Send via e-mail to subscribers"
            variant="soft"
            color="primary"
            defaultChecked
          />
        </FormControl>
      </section>

      <div className="action-buttons">
        <Link to={`/compose/${post.id}`} className="underlined disappears">Edit Post</Link>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button className={classNames("button filled", { loading: isSubmittingForm })} disabled={isSubmittingForm} onClick={handleFormSubmit}>
          {isSubmittingForm && <ButtonLoader/>}
          <span>Publish</span>
        </button>
      </div>
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
