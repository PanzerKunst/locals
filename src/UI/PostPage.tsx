import _isEmpty from "lodash/isEmpty"
import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { Post } from "./_CommonComponents/Post/Post.tsx"
import { SuccessSnackbar } from "./_CommonComponents/Snackbar/SuccessSnackbar.tsx"
import { fetchPostOfUserAndSlug } from "../Data/Backend/Apis/PostsApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../Util/BrowserUtils.ts"

export function PostPage() {
  const { atUsername, slug } = useParams()

  const postQuery = useQuery(
    "post",
    () => fetchPostOfUserAndSlug(atUsername!.substring(1), slug!), {
      enabled: !_isEmpty(atUsername) && !_isEmpty(slug)
    }
  )

  if (_isEmpty(atUsername) || _isEmpty(slug)) {
    return renderContents(<span>Invalid post url</span>)
  }

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  const actionFromUrl = getUrlQueryParam(appUrlQueryParam.ACTION)

  return renderContents(
    <>
      {actionFromUrl === actionsFromAppUrl.PUBLICATION_SUCCESS && (
        <SuccessSnackbar>
          <span>Publication successful</span>
        </SuccessSnackbar>
      )}

      {!postQuery.data?.post.publishedAt && <span>Post not found</span>}
      {postQuery.data?.post.publishedAt && <Post postWithAuthorAndTags={postQuery.data} />}
    </>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page post">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
