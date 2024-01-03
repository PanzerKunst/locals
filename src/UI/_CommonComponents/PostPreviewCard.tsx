import { Link } from "react-router-dom"

import { getPostPath } from "../../Data/Backend/BackendUtils.ts"
import { PostWithTags } from "../../Data/Backend/Models/PostWithTags.ts"

type Props = {
  postWithAuthorAndTags: PostWithTags;
}

export function PostPreviewCard({ postWithAuthorAndTags }: Props) {
  const { post } = postWithAuthorAndTags

  return (
    <Link to={getPostPath(postWithAuthorAndTags)}>
      {post.title && <h2>{post.title}</h2>}
      <p dangerouslySetInnerHTML={{ __html: post.content }}/>
    </Link>
  )
}
