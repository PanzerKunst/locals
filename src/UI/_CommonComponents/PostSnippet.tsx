import { faArrowTurnUp, faEllipsisV, faPencil, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal, ModalDialog } from "@mui/joy"
import classNames from "classnames"
import dayjs from "dayjs"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { Menu } from "./Menu.tsx"
import { PublicationDate } from "./Post/PublicationDate.tsx"
import { TaggedArtists } from "./Post/TaggedArtists.tsx"
import { VideoPlayer } from "./VideoPlayer.tsx"
import { changePostPublicationStatus, deletePost } from "../../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../../Data/Backend/BackendUtils.ts"
import { Post } from "../../Data/Backend/Models/Post.ts"
import { PostWithTags } from "../../Data/Backend/Models/PostWithTags.ts"
import { config } from "../../config.ts"
import { useViewportSize } from "../../Util/BrowserUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./PostSnippet.scss"

type Props = {
  postWithAuthorAndTags: PostWithTags;
}

export function PostSnippet({ postWithAuthorAndTags }: Props) {
  const { taggedArtists, author } = postWithAuthorAndTags

  const navigate = useNavigate()
  const location = useLocation()

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")

  const [post, setPost] = useState<Post | undefined>(postWithAuthorAndTags.post)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (!author) {
    return <li>ERROR: Author is missing</li>
  }

  if (!post) {
    return <li>ERROR: Post is undefined</li>
  }

  const handleUnpublishClick = async () => {
    setIsMenuOpen(false)
    await changePostPublicationStatus(post, false)
    setPost({ ...post, publishedAt: undefined })
  }

  const handleMenuItemDeleteClick = () => {
    setIsMenuOpen(false)
    setIsDeleteDialogOpen(true)
  }

  const handleCancelDeleteClick = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleConfirmDeleteClick = () => {
    void deletePost(post)
    setPost(undefined)
  }

  const hasHero = !!post.heroImagePath || !!post.heroVideoUrl

  return (
    <li className={classNames("post-snippet", { container: viewportWidth >= viewportWidthMd })}>
      {post.heroImagePath && (
        <Link to={getPostPath(postWithAuthorAndTags)} className="hero-image-wrapper">
          <img src={`${config.BACKEND_URL}/file/${post.heroImagePath}`} alt="Hero"/>
        </Link>
      )}
      {post.heroVideoUrl && <VideoPlayer url={post.heroVideoUrl}/>}

      <div className={classNames("metadata", { container: viewportWidth <= viewportWidthMd })}>
        <div>
          <Link to={!author.isDeleted ? `/@${author.username}` : "#"}>
            <img src={!author.isDeleted ? author.avatarUrl : "/images/deleted-user-avatar.png"} alt="Author's avatar"/>
          </Link>
          <Link to={!author.isDeleted ? `/@${author.username}` : "#"} className="underlined appears">
            <span>{!author.isDeleted ? author.name : "Deleted User"}</span>
          </Link>
          <PublicationDate publishedAt={post.publishedAt || dayjs().toISOString()}/>
        </div>

        <TaggedArtists taggedArtists={taggedArtists}/>
      </div>

      <Link
        to={getPostPath(postWithAuthorAndTags)}
        className={classNames("title-and-content-wrapper", { container: viewportWidth <= viewportWidthMd })}
      >
        {post.title && <h2>{post.title}</h2>}
        <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}/>
      </Link>

      {!post.publishedAt && <span className={classNames("basic-chip", { negative: hasHero })}>DRAFT</span>}

      {location.pathname === "/posts" && (
        <button className={classNames("button icon-only offset-bg-on-hover", { light: hasHero })} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faEllipsisV}/>
        </button>
      )}

      {isMenuOpen && ( /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
        <Menu close={() => setIsMenuOpen(false)}>
          <li role="link" onClick={() => navigate(`/compose/${post.id}`)}>
            <FontAwesomeIcon icon={faPencil}/>
            <span>Edit</span>
          </li>
          {post.publishedAt && ( // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <li role="button" onClick={handleUnpublishClick}>
              <FontAwesomeIcon icon={faArrowTurnUp}/>
              <span>Unpublish</span>
            </li>
          )}
          <li role="button" onClick={handleMenuItemDeleteClick}>
            <FontAwesomeIcon icon={faTrashCan}/>
            <span>Delete</span>
          </li>
        </Menu>
        /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
      )}

      {isDeleteDialogOpen && (
        <Modal open={isDeleteDialogOpen} onClose={handleCancelDeleteClick}>
          <ModalDialog>
            <button className="button icon-only close" aria-label="close" onClick={handleCancelDeleteClick}>
              <FontAwesomeIcon icon={faXmark}/>
            </button>

            <div>
              <span>Are you sure? Deletion is final.</span>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <button className="button filled fixed-height" onClick={handleConfirmDeleteClick}>
                <FontAwesomeIcon icon={faTrashCan}/>
                <span>Delete</span>
              </button>
            </div>
          </ModalDialog>
        </Modal>
      )}
    </li>
  )
}
