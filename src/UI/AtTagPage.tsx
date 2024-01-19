import _isEmpty from "lodash/isEmpty"
import { ReactNode, useEffect } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { PostSnippet } from "./_CommonComponents/PostSnippet.tsx"
import { useAppContext } from "../AppContext.tsx"
import { fetchPostsByUsername, fetchPostsTaggingArtist } from "../Data/Backend/Apis/PostsApi.ts"
import { appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"

export function AtTagPage() {
  const navigate = useNavigate()
  const loggedInUser = useAppContext().loggedInUser?.user

  const { atTag } = useParams()
  const usernameOrArtistTag = atTag?.substring(1)

  // TODO const [fromDate, setFromDate] = useState<Date>(new Date())
  const fromDate = new Date()

  useEffect(() => {
    if (!loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [loggedInUser, navigate])

  const postsByUserQuery = useQuery(
    "postsByUser",
    () => fetchPostsByUsername(usernameOrArtistTag!, fromDate), {
      enabled: !_isEmpty(usernameOrArtistTag)
    }
  )

  const postsTaggingArtistQuery = useQuery(
    "postsTaggingArtist",
    () => fetchPostsTaggingArtist(usernameOrArtistTag!, fromDate), {
      enabled: !_isEmpty(usernameOrArtistTag)
    }
  )

  if (_isEmpty(usernameOrArtistTag)) {
    return renderContents(<span className="error">Invalid url</span>)
  }

  if (postsByUserQuery.isLoading || postsTaggingArtistQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postsByUserQuery.isError || postsTaggingArtistQuery.isError) {
    return renderContents(<span className="error">Error fetching data</span>)
  }

  if (postsByUserQuery.data!.length === 0 && postsTaggingArtistQuery.data!.length === 0) {
    return renderContents(
      <div className="container">
        <p>No posts yet</p>
      </div>
    )
  }

  const postsToDisplay = postsTaggingArtistQuery.data!.length > 0
    ? postsTaggingArtistQuery.data!
    : postsByUserQuery.data!.filter((postWithTags) => !!postWithTags.post.publishedAt)

  return renderContents(
    <ul className="styleless">
      {postsToDisplay.map((postWithAuthorAndTags) => (
        <PostSnippet key={JSON.stringify(postWithAuthorAndTags)} postWithAuthorAndTags={postWithAuthorAndTags}/>
      ))}
    </ul>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page at-tag no-top-margin-on-mobile">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
