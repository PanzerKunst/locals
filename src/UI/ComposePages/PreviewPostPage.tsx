import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { fetchPostOfId } from "../../Data/Backend/Apis/PostsApi.ts"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { getPostWithTagsFromSession, savePostWithTagsInSession } from "../../Util/SessionStorage.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { Post } from "../_CommonComponents/Post/Post.tsx"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user

  const postWithTags = getPostWithTagsFromSession()

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
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
    return renderContents(<span className="danger">Error fetching data</span>)
  }

  const { post } = postQuery.data!

  const handleEditClick = () => {
    savePostWithTagsInSession(undefined)
    navigate(`/compose/${post.id}`)
  }

  const handleFormSubmit = () => {
    savePostWithTagsInSession(undefined)
    navigate(`/publish/${post.id}`)
  }

  return renderContents(
    <>
      <Post postWithAuthorAndTags={postQuery.data!} preview/>

      <FadeIn className="container action-buttons">
        <button className="underlined disappears" onClick={handleEditClick}>Edit</button>

        <AnimatedButton className="filling">
          <button className="button" onClick={handleFormSubmit}>
            <span>Set publication settings</span>
          </button>
        </AnimatedButton>
      </FadeIn>
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page preview-post">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
