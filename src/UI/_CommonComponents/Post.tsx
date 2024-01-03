import dayjs from "dayjs"
import _isEmpty from "lodash/isEmpty"
import { Link } from "react-router-dom"

import { FadeIn } from "./FadeIn.tsx"
import { PostWithTags } from "../../Data/Backend/Models/PostWithTags.ts"
import { getFormattedPostPublicationDate } from "../../Util/DateUtils.ts"
import { asTag } from "../../Util/TagUtils.ts"

import "./Post.scss"

type Props = {
  postWithAuthorAndTags: PostWithTags;
}

export function Post({ postWithAuthorAndTags }: Props) {
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

      <FadeIn className="tags-wrapper">
        <ul className="styleless">
          {taggedArtists.map(artist => {
            const tag = asTag(artist.name, "@")

            return (
              <li key={artist.id}>
                <Link to={`/${tag}`} className="underlined appears">{tag}</Link>
              </li>
            )
          })}
        </ul>
      </FadeIn>

      <FadeIn>
        <span className="author">By {author.username}</span>
      </FadeIn>

      <FadeIn>
        <span className="publication-date">{getFormattedPostPublicationDate(dayjs().toISOString())}</span>
      </FadeIn>

      <FadeIn>
        <div className="quill-preview" dangerouslySetInnerHTML={{ __html: post.content }}/>
      </FadeIn>
    </article>
  )
}
