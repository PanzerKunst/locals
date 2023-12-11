import classNames from "classnames"
import { ReactNode, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { Post } from "./_CommonComponents/Post.tsx"
import { fetchPost } from "../Data/Backend/Apis/PostsApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getEmptyPostWithTagsFromSession, saveEmptyPostWithTagsInSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)

  const emptyPostWithTags = getEmptyPostWithTagsFromSession()

  const postQuery = useQuery(
    "post",
    () => fetchPost(emptyPostWithTags!.post.id), {
      enabled: !!emptyPostWithTags
    }
  )

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  const handleEditClick = () => {
    saveEmptyPostWithTagsInSession(undefined)
    navigate(`/compose/${postQuery.data!.post.id}`)
  }

  const handlePublishClick = () => {
    setIsPublishing(true)
    saveEmptyPostWithTagsInSession(undefined)
    navigate(`/p/${postQuery.data!.post.id}?${appUrlQueryParam.POST_ID}=${postQuery.data!.post.id}&${appUrlQueryParam.ACTION}=${actionsFromAppUrl
      .PUBLICATION_SUCCESS}`)
  }

  return renderContents(
    <>
      <Post postWithTags={postQuery.data!}/>

      <FadeIn className="action-buttons">
        <button className="underlined disappears" onClick={handleEditClick}>Edit</button>

        <AnimatedButton className="filling">
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
