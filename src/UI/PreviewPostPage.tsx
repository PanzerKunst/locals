import classNames from "classnames"
import { ReactNode, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { fetchPost } from "../Data/Backend/Apis/PostsApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getEmptyPostWithTagsFromSession, saveEmptyPostWithTagsInSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)

  const emptyPostWithTags = getEmptyPostWithTagsFromSession()

  const currentPostQuery = useQuery(
    "currentPost",
    () => fetchPost(emptyPostWithTags!.post.id), {
      enabled: !!emptyPostWithTags
    }
  )

  if (currentPostQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (currentPostQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  const handleClick = () => {
    setIsPublishing(true)
    saveEmptyPostWithTagsInSession(undefined)
    navigate(`/home?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.PUBLICATION_SUCCESS}`)
  }

  return (
    <div className="page preview-post">
      <main className="container">
        <FadeIn>
          <h1>{currentPostQuery.data!.post.title}</h1>
        </FadeIn>

        <FadeIn>
          <div id="quill-preview" dangerouslySetInnerHTML={{ __html: currentPostQuery.data!.post.content }}/>
        </FadeIn>

        <FadeIn>
          <AnimatedButton className="filling">
            <button className={classNames("button", { "filling loading": isPublishing })} onClick={handleClick}>
              {isPublishing && <ButtonLoader/>}
              <span>Publish & Notify subscribers</span>
            </button>
          </AnimatedButton>
        </FadeIn>
      </main>
    </div>
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
