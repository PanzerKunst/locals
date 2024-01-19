import _isEmpty from "lodash/isEmpty"
import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { Post } from "./_CommonComponents/Post/Post.tsx"
import { fetchPostOfUserAndSlug } from "../Data/Backend/Apis/PostsApi.ts"

export function PostPage() {
  const { atUsername, slug } = useParams()
  const username = atUsername?.substring(1)

  const postQuery = useQuery(
    "post",
    () => fetchPostOfUserAndSlug(username!, slug!), {
      enabled: !_isEmpty(username) && !_isEmpty(slug)
    }
  )

  if (_isEmpty(username) || _isEmpty(slug)) {
    return renderContents(<span className="error">Invalid url</span>)
  }

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span className="error">Error fetching data</span>)
  }

  return renderContents(
    <>
      {!postQuery.data?.post.publishedAt && <span>Post not found</span>}
      {postQuery.data?.post.publishedAt && <Post postWithAuthorAndTags={postQuery.data} />}
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page post no-top-margin-on-mobile">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
