import { DeleteOutlined, Edit, MoreVert, UTurnLeft } from "@mui/icons-material"
import { Dropdown, IconButton, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem } from "@mui/joy"
import { motion, stagger, useAnimate } from "framer-motion"
import _isEmpty from "lodash/isEmpty"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { changePostPublicationStatus } from "../../Data/Backend/Apis/PostsApi.ts"
import { getPostPath } from "../../Data/Backend/BackendUtils.ts"
import { Post } from "../../Data/Backend/Models/Post.ts"
import { PostWithAuthorAndTags } from "../../Data/Backend/Models/PostWithTags.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./MyPostsList.scss"

type Props = {
  postsWithAuthorAndTags: PostWithAuthorAndTags[];
}

const motionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

export function MyPostsList({ postsWithAuthorAndTags }: Props) {
  const navigate = useNavigate()
  const [scope, animate] = useAnimate()

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

  const handleDeleteClick = (post: Post) => {
    // TODO: remove
    console.log("handleUnpublishClick", post)

    // TODO: display confirmation dialog
  }

  return (
    <ul ref={scope} className="styleless my-posts">
      {postsWithAuthorAndTags.map((postWithAuthorAndTags) => {
        const { post } = postWithAuthorAndTags

        return (
          <motion.li key={post.id} initial={motionVariants.initial}>
            <Link to={getPostPath(postWithAuthorAndTags)}>
              {post.title && <h2>{post.title}</h2>}
              <p dangerouslySetInnerHTML={{ __html: post.content }}/>
            </Link>

            <Dropdown>
              <MenuButton slots={{ root: IconButton }}><MoreVert/></MenuButton>

              <Menu variant="plain" placement="bottom-end" className="post-action-menu">
                <MenuItem onClick={() => handleEditClick(post)}>
                  <ListItemDecorator><Edit/></ListItemDecorator>
                  Edit post
                </MenuItem>
                <ListDivider/>
                {post.publishedAt && (
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  <MenuItem onClick={() => handleUnpublishClick(post)}>
                    <ListItemDecorator><UTurnLeft/></ListItemDecorator>
                    Unpublish
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleDeleteClick(post)}>
                  <ListItemDecorator><DeleteOutlined/></ListItemDecorator>
                  Delete
                </MenuItem>
              </Menu>
            </Dropdown>
          </motion.li>
        )
      })}
    </ul>
  )
}
