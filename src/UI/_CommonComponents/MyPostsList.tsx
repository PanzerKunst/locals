import { faArrowTurnUp, faEllipsisV, faPencil, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal, ModalDialog } from "@mui/joy"
import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Menu } from "./Menu.tsx"
import { PostPreviewCard } from "./PostPreviewCard.tsx"
import { changePostPublicationStatus, deletePost } from "../../Data/Backend/Apis/PostsApi.ts"
import { Post } from "../../Data/Backend/Models/Post.ts"
import { PostWithTags } from "../../Data/Backend/Models/PostWithTags.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./MyPostsList.scss"

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

const modalMotionVariants = motionVariants

type Props = {
  postsWithAuthorAndTags: PostWithTags[];
}

export function MyPostsList({ postsWithAuthorAndTags }: Props) {
  const navigate = useNavigate()
  const [scope, animate] = useAnimate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (postsWithAuthorAndTags.length === 0) {
      return
    }

    void animate(
      "li",
      motionVariants.animate,
      {
        duration: Number(s.animationDurationSm),
        delay: stagger(Number(s.animationDurationXs))
      }
    )
  }, [animate, scope, postsWithAuthorAndTags])

  const handleUnpublishClick = async (post: Post) => {
    await changePostPublicationStatus(post, false)
  }

  const handleMenuItemDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setIsMenuOpen(false)
    setIsDeleteDialogOpen(true)
  }

  const handleCancelDeleteClick = () => {
    setPostToDelete(undefined)
    setIsDeleteDialogOpen(false)
  }

  const handleConfirmDeleteClick = async () => {
    if (!postToDelete) {
      return
    }

    await deletePost(postToDelete)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <ul ref={scope} className="styleless my-posts">
        {postsWithAuthorAndTags.map((postWithAuthorAndTags) => {
          const { post } = postWithAuthorAndTags

          return (
            <motion.li key={post.id} initial={motionVariants.initial}>
              <PostPreviewCard postWithAuthorAndTags={postWithAuthorAndTags}/>

              {!post.publishedAt && <span>Draft</span>}

              <button className="button icon-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FontAwesomeIcon icon={faEllipsisV}/>
              </button>

              {isMenuOpen && ( /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
                <Menu close={() => setIsMenuOpen(false)}>
                  <li role="link" onClick={() => navigate(`/compose/${post.id}`)}>
                    <FontAwesomeIcon icon={faPencil}/>
                    <span>Edit</span>
                  </li>
                  {post.publishedAt && ( // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    <li role="button" onClick={() => handleUnpublishClick(post)}>
                      <FontAwesomeIcon icon={faArrowTurnUp}/>
                      <span>Unpublish</span>
                    </li>
                  )}
                  <li role="button" onClick={() => handleMenuItemDeleteClick(post)}>
                    <FontAwesomeIcon icon={faTrashCan}/>
                    <span>Delete</span>
                  </li>
                </Menu>
                /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-to-interactive-role */
              )}
            </motion.li>
          )
        })}
      </ul>

      <AnimatePresence>
        {isDeleteDialogOpen && (
          <Modal open={isDeleteDialogOpen} onClose={handleCancelDeleteClick}>
            <motion.div
              initial={modalMotionVariants.initial}
              animate={modalMotionVariants.animate}
              exit={modalMotionVariants.initial}
              transition={{ duration: Number(s.animationDurationSm) }}
            >
              <ModalDialog>
                <button className="button icon-only close" aria-label="close" onClick={handleCancelDeleteClick}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <div>
                  <span>Are you sure? Deletion is final.</span>
                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <button className="button filled fixed-height" onClick={handleConfirmDeleteClick}>
                    <FontAwesomeIcon icon={faTrashCan} />
                    <span>Delete</span>
                  </button>
                </div>
              </ModalDialog>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
