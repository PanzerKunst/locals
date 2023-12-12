import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { fetchPostsByUser } from "../../Data/Backend/Apis/PostsApi.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { MyPostsList } from "../_CommonComponents/MyPostsList.tsx"

export function MyPostsPage() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()

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

  return renderContents(<MyPostsList postsWithAuthorAndTags={userPostsQuery.data!}/>)

  function renderContents(children: ReactNode) {
    return (
      <div className="page my-posts">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
