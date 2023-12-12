import { DeleteOutlined, Edit, MoreVert, UTurnLeft } from "@mui/icons-material"
import { Dropdown, IconButton, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem } from "@mui/joy"
import { motion, stagger, useAnimate } from "framer-motion"
import _isEmpty from "lodash/isEmpty"
import { useEffect } from "react"
import { Link } from "react-router-dom"

import { PostWithAuthorAndTags } from "../../Data/Backend/Models/PostWithTags.ts"
import { getPostPath } from "../../Data/Backend/BackendUtils.ts"

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
              <MenuButton slots={{ root: IconButton }}><MoreVert /></MenuButton>

              <Menu variant="plain" placement="bottom-end" className="post-action-menu">
                <MenuItem>
                  <ListItemDecorator><Edit/></ListItemDecorator>
                  Edit post
                </MenuItem>
                <ListDivider />
                <MenuItem>
                  <ListItemDecorator><UTurnLeft/></ListItemDecorator>
                  Unpublish
                </MenuItem>
                <MenuItem>
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
