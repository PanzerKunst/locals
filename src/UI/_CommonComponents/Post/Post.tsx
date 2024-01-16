import classNames from "classnames"
import dayjs from "dayjs"
import _isEmpty from "lodash/isEmpty"
import { Link } from "react-router-dom"

import { LikesCommentsShare } from "./LikesCommentsShare.tsx"
import { PublicationDate } from "./PublicationDate.tsx"
import { TaggedArtists } from "./TaggedArtists.tsx"
import { useAppContext } from "../../../AppContext.tsx"
import { storeUserFollowingAuthor } from "../../../Data/Backend/Apis/UserFollowingAuthorsApi.ts"
import { PostWithTags } from "../../../Data/Backend/Models/PostWithTags.ts"
import { config } from "../../../config.ts"
import { FadeIn } from "../FadeIn.tsx"
import { VideoPlayer } from "../VideoPlayer.tsx"
import { useViewportSize } from "../../../Util/BrowserUtils.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
import "./Post.scss"

type Props = {
  postWithAuthorAndTags: PostWithTags;
  preview?: boolean;
}

export function Post({ postWithAuthorAndTags, preview = false }: Props) {
  const { post, author, taggedArtists } = postWithAuthorAndTags

  const appContext = useAppContext()
  const loggedInUser = appContext.loggedInUser?.user
  const loggedInUserFollowedAuthors = appContext.loggedInUser?.followedAuthors || []

  const viewportWidth = useViewportSize().width
  const viewportWidthMd = parseInt(s.vwMd || "")

  const onFollowClick = () => {
    if (!loggedInUser || !author) {
      return
    }
    
    void storeUserFollowingAuthor(appContext, loggedInUser, author)
  }

  if (!author) {
    return <span>ERROR: Author is missing</span>
  }

  const isFollowingAuthor = author.id === loggedInUser?.id || loggedInUserFollowedAuthors.some(followedAuthor => followedAuthor.id === author.id)

  return (
    <article className="post">
      {!_isEmpty(post.title) && (
        <FadeIn className="container">
          <h1>{post.title}</h1>
        </FadeIn>
      )}

      <FadeIn className="metadata container">
        <div className="author-and-publication-date">
          <Link to={`/@${author.username}`}>
            <img src={author.avatarUrl} alt="Author's avatar"/>
          </Link>
          <div>
            <div className="author-and-follow">
              <Link to={`/@${author.username}`} className="underlined appears">
                <span>{author.name}</span>
              </Link>
              {isFollowingAuthor && <span>Following</span>}
              {loggedInUser && !isFollowingAuthor && <button className="underlined appears" onClick={onFollowClick}>Follow</button>}
            </div>
            <div className="publication-date-wrapper">
              <PublicationDate publishedAt={post.publishedAt || dayjs().toISOString()}/>-<span>Public</span>
            </div>
          </div>
        </div>

        <LikesCommentsShare disabled={preview}/>
        <TaggedArtists taggedArtists={taggedArtists}/>

        <div className="mobile-only">
          <LikesCommentsShare disabled={preview}/>
          <TaggedArtists taggedArtists={taggedArtists}/>
        </div>
      </FadeIn>

      <FadeIn className={classNames("hero", { container: viewportWidth >= viewportWidthMd })}>
        {post.heroImagePath && <img src={`${config.BACKEND_URL}/file/${post.heroImagePath}`} alt="Hero"/>}
        {post.heroVideoUrl && <VideoPlayer url={post.heroVideoUrl}/>}
      </FadeIn>

      <FadeIn className="content container">
        <div dangerouslySetInnerHTML={{ __html: post.content }}/>
      </FadeIn>
    </article>
  )
}
