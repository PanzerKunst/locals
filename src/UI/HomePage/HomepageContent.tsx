import { useQuery } from "react-query"

import { useAppContext } from "../../AppContext.tsx"
import { fetchHomepagePostsForUserId } from "../../Data/Backend/Apis/PostsApi.ts"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { PostSnippet } from "../_CommonComponents/PostSnippet.tsx"

export function HomepageContent() {
  const loggedInUser = useAppContext().loggedInUser?.user

  // TODO const [fromDate, setFromDate] = useState<Date>(new Date())
  const fromDate = new Date()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const homepagePostsQuery = useQuery(
    "homepagePosts",
    () => fetchHomepagePostsForUserId(loggedInUser!.id, fromDate), {
      enabled: !!loggedInUser
    }
  )

  if (homepagePostsQuery.isLoading) {
    return <CircularLoader/>
  }

  if (homepagePostsQuery.isError) {
    return <span className="error">Error fetching data</span>
  }

  if (homepagePostsQuery.data!.length === 0) {
    return (
      <div className="container">
        <p>No posts yet</p>
      </div>
    )
  }

  return (
    <ul className="styleless">
      {homepagePostsQuery.data!.map((postWithAuthorAndTags) => (
        <PostSnippet key={JSON.stringify(postWithAuthorAndTags.post)} postWithAuthorAndTags={postWithAuthorAndTags}/>
      ))}
    </ul>
  )
}
