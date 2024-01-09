import classNames from "classnames"
import { ReactNode, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { Post } from "./_CommonComponents/Post/Post.tsx"
import { useAppContext } from "../AppContext.tsx"
import { changePostPublicationStatus, fetchPostOfId } from "../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../Data/Backend/BackendUtils.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getPostWithTagsFromSession, savePostWithTagsInSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()
  const [isPublishing, setIsPublishing] = useState(false)

  const postWithTags = getPostWithTagsFromSession()

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const postQuery = useQuery(
    "post",
    () => fetchPostOfId(postWithTags!.post.id), {
      enabled: !!postWithTags
    }
  )

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  const handleEditClick = () => {
    savePostWithTagsInSession(undefined)
    navigate(`/compose/${postQuery.data!.post.id}`)
  }

  const handlePublishClick = async () => {
    setIsPublishing(true)

    const postWithSlugAndAuthor = await changePostPublicationStatus(postQuery.data!.post, true)
    savePostWithTagsInSession(undefined)

    navigate(`${getPostPath(postWithSlugAndAuthor)}?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.PUBLICATION_SUCCESS}`)
  }

  return renderContents(
    <>
      <Post postWithAuthorAndTags={postQuery.data!} preview/>

      <FadeIn className="action-buttons">
        <button className="underlined disappears" onClick={handleEditClick}>Edit</button>

        <AnimatedButton className="filling">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <button className={classNames("button", { "filling loading": isPublishing })} onClick={handlePublishClick}>
            {isPublishing && <ButtonLoader/>}
            <span>Publish & Notify subscribers</span>
          </button>
        </AnimatedButton>
      </FadeIn>
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page preview-post">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
