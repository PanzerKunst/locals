import { PostWithTags } from "./Models/PostWithTags.ts"

export function getPostPath(postWithAuthorAndTags: PostWithTags): string {
  const { post, author } = postWithAuthorAndTags
  return `/@${author!.username}/${post.slug}`
}
