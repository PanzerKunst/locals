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
import { getEmptyPostFromSession, saveEmptyPostInSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)

  const emptyPost = getEmptyPostFromSession()

  const currentPostQuery = useQuery(
    "currentPost",
    () => fetchPost(emptyPost!.id), {
      enabled: !!emptyPost
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
    saveEmptyPostInSession(undefined)
    navigate(`/home?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.PUBLICATION_SUCCESS}`)
  }

  return (
    <div className="page preview-post">
      <main className="container">
        <div id="quill-preview" dangerouslySetInnerHTML={{ __html: currentPostQuery.data!.content }}/>

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
