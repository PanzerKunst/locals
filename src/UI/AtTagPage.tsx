import _isEmpty from "lodash/isEmpty"
import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { PostSnippet } from "./_CommonComponents/PostSnippet.tsx"
import { fetchPostsByUsername, fetchPostsTaggingArtist } from "../Data/Backend/Apis/PostsApi.ts"

export function AtTagPage() {
  const { atTag } = useParams()
  const usernameOrArtistTag = atTag?.substring(1)

  const postsByUserQuery = useQuery(
    "postsByUser",
    () => fetchPostsByUsername(usernameOrArtistTag!), {
      enabled: !_isEmpty(usernameOrArtistTag)
    }
  )

  const postsTaggingArtistQuery = useQuery(
    "postsTaggingArtist",
    () => fetchPostsTaggingArtist(usernameOrArtistTag!), {
      enabled: !_isEmpty(usernameOrArtistTag)
    }
  )

  if (_isEmpty(usernameOrArtistTag)) {
    return renderContents(<span>Invalid post url</span>)
  }

  if (postsByUserQuery.isLoading || postsTaggingArtistQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postsByUserQuery.isError || postsTaggingArtistQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  if (postsByUserQuery.data!.length === 0 && postsTaggingArtistQuery.data!.length === 0) {
    return renderContents(
      <div className="container">
        <p>No posts yet</p>
      </div>
    )
  }

  const posts = postsTaggingArtistQuery.data!.length > 0 ? postsTaggingArtistQuery.data! : postsByUserQuery.data!

  return renderContents(
    <ul className="styleless">
      {posts.map((postWithAuthorAndTags) => (
        <PostSnippet key={postWithAuthorAndTags.post.id} postWithAuthorAndTags={postWithAuthorAndTags}/>
      ))}
    </ul>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page at-tag">
        <main>
          {children}
        </main>
      </div>
    )
  }
}
