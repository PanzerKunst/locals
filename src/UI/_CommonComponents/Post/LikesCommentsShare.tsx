import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./LikesCommentsShare.scss"

type Props = {
  disabled?: boolean;
}

export function LikesCommentsShare({ disabled = false }: Props) {
  const likesCount = 199
  const commentsCount = 12

  return (
    <div className="likes-comments-share">
      <button className="button transparent rounded" disabled={disabled}>
        <FontAwesomeIcon icon={faHeart}/>
        <span>{likesCount}</span>
      </button>

      <button className="button transparent rounded" disabled={disabled}>
        <FontAwesomeIcon icon={faComment}/>
        <span>{commentsCount}</span>
      </button>

      <button className="button transparent rounded" disabled={disabled}>
        <FontAwesomeIcon icon={faLink} />
        <span>Share</span>
      </button>
    </div>
  )
}
