import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import { useAppContext } from "../../AppContext.tsx"
import { fetchPostsByUser } from "../../Data/Backend/Apis/PostsApi.ts"
import { appUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { AnimatedButton } from "../_CommonComponents/AnimatedButton.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "../_CommonComponents/FadeIn.tsx"
import { MyPostsList } from "../_CommonComponents/MyPostsList.tsx"

import "./MyPostsPage.scss"

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
          <FadeIn>
            <h1>My posts</h1>
            <AnimatedButton className="filling">
              <Link to="/compose" className="button"><span>Compose</span></Link>
            </AnimatedButton>
          </FadeIn>
          {children}
        </main>
      </div>
    )
  }
}
