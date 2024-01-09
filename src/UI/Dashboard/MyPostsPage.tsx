import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { fetchPostsByUser } from "../../Data/Backend/Apis/PostsApi.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { PostSnippet } from "../_CommonComponents/PostSnippet.tsx"

export function MyPostsPage() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()

  useHeaderTitle("My Posts")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const userPostsQuery = useQuery(
    "userPosts",
    () => fetchPostsByUser(loggedInUser!), {
      enabled: !!loggedInUser
    }
  )

  if (userPostsQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (userPostsQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  return renderContents(
    <ul className="styleless">
      {userPostsQuery.data!.map((postWithAuthorAndTags) => (
        <PostSnippet key={postWithAuthorAndTags.post.id} postWithAuthorAndTags={postWithAuthorAndTags}/>
      ))}
    </ul>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page my-posts">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
