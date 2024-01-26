import { faComment, faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faHeart as faHeartSolid, faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

import { useAppContext } from "../../../AppContext.tsx"
import { deletePostLike, fetchPostLikes, storePostLike } from "../../../Data/Backend/Apis/PostLikesApi.ts"
import { ErrorSnackbar } from "../Snackbar/ErrorSnackbar.tsx"

import "./LikesCommentsShare.scss"

type Props = {
  postId: number;
  preview?: boolean;
}

export function LikesCommentsShare({ postId, preview = false }: Props) {
  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser?.user

  const postLikesQuery = useQuery(
    "postLikes",
    () => fetchPostLikes(postId, loggedInUser)
  )

  const [likesCount, setLikesCount] = useState(-1)
  const [isLiked, setIsLiked] = useState(false)
  
  useEffect(() => {
    if (!postLikesQuery.data) {
      return
    }

    const { count, isLikedByUser } = postLikesQuery.data
    setLikesCount(count)
    setIsLiked(isLikedByUser)
  }, [postLikesQuery.data])

  const commentsCount = 12

  const handleLikeClick = async () => {
    if (!loggedInUser || !postLikesQuery.data) {
      return
    }

    if (isLiked) {
      await deletePostLike(postId, loggedInUser)
      setLikesCount(likesCount - 1)
    } else {
      await storePostLike(postId, loggedInUser)
      setLikesCount(likesCount + 1)
    }

    setIsLiked(!isLiked)
  }

  return (
    <div className="likes-comments-share">
      {postLikesQuery.isError && <ErrorSnackbar message="Error fetching post likes"/>}

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button className="button transparent rounded" onClick={handleLikeClick} disabled={preview || !loggedInUser}>
        {isLiked ? <FontAwesomeIcon icon={faHeartSolid} className="active"/> : <FontAwesomeIcon icon={faHeartRegular}/>}
        <span>{likesCount}</span>
      </button>

      <button className="button transparent rounded" disabled={preview}>
        <FontAwesomeIcon icon={faComment}/>
        <span>{commentsCount}</span>
      </button>

      <button className="button transparent rounded" disabled={preview}>
        <FontAwesomeIcon icon={faLink}/>
        <span>Share</span>
      </button>
    </div>
  )
}
