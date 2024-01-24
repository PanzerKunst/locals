import { PostWithTags } from "./Models/PostWithMore.ts"

export function getPostPath(postWithAuthorAndTags: PostWithTags): string {
  const { post, author } = postWithAuthorAndTags
  return `/@${author!.username}/${post.slug}`
}
