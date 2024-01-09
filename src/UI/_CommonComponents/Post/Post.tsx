import dayjs from "dayjs"
import _isEmpty from "lodash/isEmpty"

import { LikesCommentsShare } from "./LikesCommentsShare.tsx"
import { PublicationDate } from "./PublicationDate.tsx"
import { TaggedArtists } from "./TaggedArtists.tsx"
import { PostWithTags } from "../../../Data/Backend/Models/PostWithTags.ts"
import { config } from "../../../config.ts"
import { FadeIn } from "../FadeIn.tsx"
import { VideoPlayer } from "../VideoPlayer.tsx"

import "./Post.scss"

type Props = {
  postWithAuthorAndTags: PostWithTags;
  preview?: boolean;
}

export function Post({ postWithAuthorAndTags, preview = false }: Props) {
  const { post, author, taggedArtists } = postWithAuthorAndTags

  if (!author) {
    return <span>ERROR: Author is missing</span>
  }

  return (
    <article>
      {!_isEmpty(post.title) && (
        <FadeIn>
          <h1>{post.title}</h1>
        </FadeIn>
      )}

      <FadeIn className="metadata">
        <PublicationDate publishedAt={post.publishedAt || dayjs().toISOString()}/>
        <LikesCommentsShare disabled={preview}/>
        <TaggedArtists taggedArtists={taggedArtists}/>
      </FadeIn>

      <FadeIn className="hero">
        {post.heroImagePath && <img src={`${config.BACKEND_URL}/file/${post.heroImagePath}`} alt="Hero"/>}
        {post.heroVideoUrl && <VideoPlayer url={post.heroVideoUrl}/>}
      </FadeIn>

      <FadeIn className="content">
        <div dangerouslySetInnerHTML={{ __html: post.content }}/>
      </FadeIn>
    </article>
  )
}
