import classNames from "classnames"
import dayjs from "dayjs"
import { ReactNode, useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { useAppContext } from "../AppContext.tsx"
import { fetchPost } from "../Data/Backend/Apis/PostsApi.ts"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getFormattedPostPublicationDate } from "../Util/DateUtils.ts"
import { getEmptyPostWithTagsFromSession, saveEmptyPostWithTagsInSession } from "../Util/SessionStorage.ts"
import { capitalizeAndWithoutSpaces } from "../Util/StringUtils.ts"
import { asTag } from "../Util/TagUtils.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const { loggedInUser } = useAppContext()
  const [isPublishing, setIsPublishing] = useState(false)

  const emptyPostWithTags = getEmptyPostWithTagsFromSession()

  const postQuery = useQuery(
    "post",
    () => fetchPost(emptyPostWithTags!.post.id), {
      enabled: !!emptyPostWithTags
    }
  )

  if (postQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (postQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  const handleEditClick = () => {
    saveEmptyPostWithTagsInSession(undefined)
    navigate(`/compose/${postQuery.data!.post.id}`)
  }

  const handlePublishClick = () => {
    setIsPublishing(true)
    saveEmptyPostWithTagsInSession(undefined)
    navigate(`/p/SLUG?${appUrlQueryParam.POST_ID}=${postQuery.data!.post.id}&${appUrlQueryParam.ACTION}=${actionsFromAppUrl.PUBLICATION_SUCCESS}`)
  }

  return (
    <div className="page preview-post">
      <main className="container">
        <FadeIn>
          <h1>{postQuery.data!.post.title}</h1>
        </FadeIn>

        <FadeIn className="tags-wrapper">
          <ul className="styleless">
            {postQuery.data!.taggedArtists.map(artist => {
              const tag = asTag(artist.name, "@")

              return (
                <li key={artist.id}>
                  <Link to={`/${tag}`} className="underlined appears">{tag}</Link>
                </li>
              )
            })}
          </ul>
          <ul className="styleless">
            {postQuery.data!.taggedGenres.map(musicGenre => (
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
          <div className="quill-preview" dangerouslySetInnerHTML={{ __html: postQuery.data!.post.content }}/>
        </FadeIn>

        <FadeIn className="action-buttons">
          <button className="underlined disappears" onClick={handleEditClick}>Edit</button>

          <AnimatedButton className="filling">
            <button className={classNames("button", { "filling loading": isPublishing })} onClick={handlePublishClick}>
              {isPublishing && <ButtonLoader/>}
              <span>Publish & Notify subscribers</span>
            </button>
          </AnimatedButton>
        </FadeIn>
      </main>
    </div>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page preview-post">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
