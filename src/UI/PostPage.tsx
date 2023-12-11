import { ReactNode } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { Post } from "./_CommonComponents/Post.tsx"
import { SuccessSnackbar } from "./_CommonComponents/Snackbar/SuccessSnackbar.tsx"
import { fetchPost } from "../Data/Backend/Apis/PostsApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getUrlQueryParam } from "../Util/BrowserUtils.ts"
import { isOnlyDigitsAndNotEmpty } from "../Util/ValidationUtils.ts"

export function PostPage() {
  const { postId } = useParams()

  const postQuery = useQuery(
    "post",
    () => fetchPost(Number(postId)), {
      enabled: isOnlyDigitsAndNotEmpty(postId)
    }
  )

  if (!isOnlyDigitsAndNotEmpty(postId)) {
    return renderContents(<span>Invalid post id</span>)
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

      <Post postWithTags={postQuery.data!}/>
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
