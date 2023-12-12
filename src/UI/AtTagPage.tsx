import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { fetchPost } from "../Data/Backend/Apis/PostsApi.ts"

export function AtTagPage() {
  const { atTag } = useParams()

  // TODO: remove
  console.log("AtTagPage > atTag", atTag)
  const postId = 1

  const postQuery = useQuery(
    "post",
    () => fetchPost(postId), {
      enabled: !isNaN(postId)
    }
  )

  if (isNaN(postId)) {
    return renderContents(<span>Invalid post url</span>)
  }

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  return renderContents(
    <ul className="styleless">
    </ul>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page at-tag">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
