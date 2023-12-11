import dayjs from "dayjs"
import _isEmpty from "lodash/isEmpty"
import { Link } from "react-router-dom"

import { FadeIn } from "./FadeIn.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { PostWithTags } from "../../Data/Backend/Models/PostWithTags.ts"
import { getFormattedPostPublicationDate } from "../../Util/DateUtils.ts"
import { capitalizeAndWithoutSpaces } from "../../Util/StringUtils.ts"
import { asTag } from "../../Util/TagUtils.ts"

import "./Post.scss"

type Props = {
  postWithTags: PostWithTags;
}

export function Post({ postWithTags }: Props) {
  const { loggedInUser } = useAppContext()
  const { post, taggedArtists, taggedGenres } = postWithTags

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
        <ul className="styleless">
          {taggedGenres.map(musicGenre => (
            <li key={musicGenre.id}>
              <Link to={`/genre/${capitalizeAndWithoutSpaces(musicGenre.name)}`} className="underlined appears">{asTag(musicGenre.name, "#")}</Link>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn>
        <span className="author">By {loggedInUser?.username}</span>
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
