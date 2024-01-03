import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dropdown, IconButton, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem, Modal, ModalDialog } from "@mui/joy"
import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion"
import _isEmpty from "lodash/isEmpty"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { faArrowTurnUp, faEllipsisV, faPencil, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons"

import { PostPreview } from "./PostPreview.tsx"
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
  const [postToDelete, setPostToDelete] = useState<Post>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (_isEmpty(postsWithAuthorAndTags)) {
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

  const handleEditClick = (post: Post) => {
    navigate(`/compose/${post.id}`)
  }

  const handleUnpublishClick = async (post: Post) => {
    await changePostPublicationStatus(post, false)
  }

  const handleMenuItemDeleteClick = (post: Post) => {
    setPostToDelete(post)
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
              <PostPreview postWithAuthorAndTags={postWithAuthorAndTags}/>

              {!post.publishedAt && <span>Draft</span>}

              <Dropdown>
                <MenuButton slots={{ root: IconButton }}><FontAwesomeIcon icon={faEllipsisV} /></MenuButton>

                <Menu variant="plain" placement="bottom-end" className="post-action-menu">
                  <MenuItem onClick={() => handleEditClick(post)}>
                    <ListItemDecorator><FontAwesomeIcon icon={faPencil} /></ListItemDecorator>
                    Edit post
                  </MenuItem>
                  <ListDivider/>
                  {post.publishedAt && (
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    <MenuItem onClick={() => handleUnpublishClick(post)}>
                      <ListItemDecorator><FontAwesomeIcon icon={faArrowTurnUp} /></ListItemDecorator>
                      Unpublish
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleMenuItemDeleteClick(post)}>
                    <ListItemDecorator><FontAwesomeIcon icon={faTrashCan} /></ListItemDecorator>
                    Delete
                  </MenuItem>
                </Menu>
              </Dropdown>
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
