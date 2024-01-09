import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"

import "./LikesCommentsShare.scss"

type Props = {
  disabled?: boolean;
  className?: string;
}

export function LikesCommentsShare({ disabled = false, className = "" }: Props) {
  const likesCount = 199
  const commentsCount = 12

  return (
    <div className={classNames("likes-comments-share", className)}>
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
