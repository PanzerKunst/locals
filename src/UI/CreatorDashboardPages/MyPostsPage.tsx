import classNames from "classnames"
import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { DashboardSidebar } from "./DashboardSidebar.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { fetchPostsByUsername } from "../../Data/Backend/Apis/PostsApi.ts"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { PostSnippet } from "../_CommonComponents/PostSnippet.tsx"
import { useSidebarNav } from "../_CommonComponents/SidebarNav.ts"

export function MyPostsPage() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user
  const { isSidebarHidden, isSidebarHideable } = useSidebarNav()

  // TODO const [fromDate, setFromDate] = useState<Date>(new Date())
  const fromDate = new Date()

  useHeaderTitle(isSidebarHideable && !isSidebarHidden ? "Creator Dashboard" : "My Posts")

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const userPostsQuery = useQuery(
    "userPosts",
    () => fetchPostsByUsername(loggedInUser!.username, fromDate), {
      enabled: !!loggedInUser
    }
  )

  if (userPostsQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (userPostsQuery.isError) {
    return renderContents(<span className="danger">Error fetching data</span>)
  }

  if (userPostsQuery.data!.length === 0) {
    return renderContents(
      <div className="container">
        <p>No posts yet</p>
      </div>
    )
  }

  return renderContents(
    <ul className="styleless">
      {userPostsQuery.data!.map((postWithAuthorAndTags) => (
        <PostSnippet key={JSON.stringify(postWithAuthorAndTags.post)} postWithAuthorAndTags={postWithAuthorAndTags}/>
      ))}
    </ul>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className={classNames("page with-sidebar dashboard my-posts no-top-margin-on-mobile",
        { "sidebar-hidden": isSidebarHideable && isSidebarHidden }
      )}>
        <DashboardSidebar />
        <main>
          {children}
        </main>
      </div>
    )
  }
}
