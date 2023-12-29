import { FormControl, FormHelperText, Input } from "@mui/joy"
import classNames from "classnames"
import _isEmpty from "lodash/isEmpty"
import _sample from "lodash/sample"
import Quill from "quill"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { ChipList } from "./_CommonComponents/ChipList.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SelectList } from "./_CommonComponents/SelectList.tsx"
import { useAppContext } from "../AppContext.tsx"
import { storeArtists } from "../Data/Backend/Apis/ArtistsApi.ts"
import { fetchPostOfId, storePost, updatePost } from "../Data/Backend/Apis/PostsApi.ts"
import { Artist } from "../Data/Backend/Models/Artist.ts"
import { EmptyPostWithTags } from "../Data/Backend/Models/PostWithTags.ts"
import { searchArtists } from "../Data/Spotify/Apis/SearchApi.ts"
import { appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { scrollIntoView } from "../Util/BrowserUtils.ts"
import { isEditorEmpty } from "../Util/QuillUtils.ts"
import { useDebounce } from "../Util/ReactUtils.ts"
import { getEmptyPostWithTagsFromSession, saveEmptyPostWithTagsInSession } from "../Util/SessionStorage.ts"
import { asTag } from "../Util/TagUtils.ts"
import { Field, isOnlyDigitsAndNotEmpty } from "../Util/ValidationUtils.ts"

import "./ComposePage.scss"

const maxTaggedArtists = 2

const editorPlaceholders = ["Tell your story..."]

export function ComposePage() {
  const navigate = useNavigate()
  const { postId } = useParams()

  const appContext = useAppContext()

  const [artistQuery, setArtistQuery] = useState("")
  const debouncedArtistQuery = useDebounce(artistQuery, 300)
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const [artistSearchResults, setArtistSearchResults] = useState<Artist[]>([])
  const [taggedArtists, setTaggedArtists] = useState<Artist[]>([])

  const [tagsError, setTagsError] = useState("")

  const [titleField, setTitleField] = useState<Field>({ value: "", error: "" })
  const editorRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<Quill>()
  const [editorError, setEditorError] = useState("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  useEffect(() => {
    if (!appContext.loggedInUser) {
      navigate(`/?${appUrlQueryParam.ACCESS_ERROR}`, { replace: true })
    }
  }, [appContext.loggedInUser, navigate])

  useEffect(() => {
    if (quill || !editorRef.current) {
      return
    }

    const quillEditor = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: _sample(editorPlaceholders),
      formats: ["header", "bold", "italic", "strike", "link", "image", "video", "blockquote"],
      modules: {
        toolbar: [
          [{ "header": [2, 3, false] }],
          ["bold", "italic", "strike"],
          ["link", "image", "video"],
          ["blockquote"],
          ["clean"]
        ]
      }
    })

    setQuill(quillEditor)

    const emptyPostWithTags = getEmptyPostWithTagsFromSession()

    if (emptyPostWithTags) {
      initPostTitleAndTags(emptyPostWithTags)
      void initQuillContent(emptyPostWithTags.post.id)
    } else if (isOnlyDigitsAndNotEmpty(postId)) {
      void initPostFromId(Number(postId))
    }

    function initPostTitleAndTags(emptyPostWithTags: EmptyPostWithTags) {
      setTitleField({
        value: emptyPostWithTags.post.title || "",
        error: "" // We reset any eventual errors
      })

      setTaggedArtists(emptyPostWithTags.taggedArtists)
    }

    async function initPostFromId(postId: number) {
      const postWithAuthorAndTags = await fetchPostOfId(postId)

      if (!postWithAuthorAndTags) {
        return
      }

      initPostTitleAndTags(postWithAuthorAndTags)
      quillEditor.root.innerHTML = postWithAuthorAndTags.post.content
    }

    async function initQuillContent(postId: number) {
      const postWithAuthorAndTags = await fetchPostOfId(postId)

      if (!postWithAuthorAndTags) {
        return
      }

      quillEditor.root.innerHTML = postWithAuthorAndTags.post.content
    }
  }, [postId, quill])

  useEffect(() => {
    if (!quill) {
      return
    }

    function handleTextChange() {
      setEditorError("") // We reset any eventual errors
    }

    // Register handler
    quill.on("text-change", handleTextChange)

    // Cleanup
    return () => {
      quill.off("text-change", handleTextChange)
    }
  }, [quill])

  useEffect(() => {
    async function performArtistSearch() {
      setIsSearchingArtists(true)
      const queryWithoutAtSign = debouncedArtistQuery.replace("@", "")
      const searchResults = await searchArtists(appContext, queryWithoutAtSign)
      const matchingArtistsWithGenres = await storeArtists(searchResults)
      setIsSearchingArtists(false)
      setArtistSearchResults(matchingArtistsWithGenres.map((artistWithGenres) => artistWithGenres.artist))
    }

    setArtistSearchResults([])

    if (debouncedArtistQuery === "") {
      setIsSearchingArtists(false)
      return
    }

    void performArtistSearch()
  }, [appContext, debouncedArtistQuery, taggedArtists])

  function areTagsValid(): boolean {
    if (_isEmpty(taggedArtists)) {
      setTagsError("Add at least 1 artist tag")
      scrollIntoView(document.querySelector(".tag-fields"))
      return false
    }

    return true
  }

  function isEditorValid(): boolean {
    if (isEditorEmpty(quill)) {
      setEditorError("Your post needs some content")
      scrollIntoView(editorRef.current)
      return false
    }

    return true
  }

  function isFormValid(): boolean {
    return areTagsValid() && isEditorValid()
  }

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtistQuery(event.target.value)
  }

  const handleArtistSelect = (artist: Artist) => {
    if (taggedArtists.length < maxTaggedArtists &&
      !taggedArtists.some(taggedArtist => taggedArtist.id === artist.id)) {
      setTaggedArtists([...taggedArtists, artist])
    }

    setArtistQuery("")
    setTagsError("")
  }

  const handleDeleteArtistTag = (artist: Artist) => {
    setTaggedArtists(taggedArtists.filter((taggedArtist) => taggedArtist.id !== artist.id))
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setTitleField({
      value,
      error: "" // We reset any eventual errors
    })
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    let emptyPostWithTags = getEmptyPostWithTagsFromSession()

    if (!emptyPostWithTags && isOnlyDigitsAndNotEmpty(postId)) {
      emptyPostWithTags = await fetchPostOfId(Number(postId))
    }

    const storedEmptyPostWithTags = emptyPostWithTags
      ? await updatePost(emptyPostWithTags.post, titleField.value, taggedArtists, quill!)
      : await storePost(appContext, titleField.value, taggedArtists, quill!)

    saveEmptyPostWithTagsInSession(storedEmptyPostWithTags)

    navigate("/compose/preview")
  }

  return renderContents(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form noValidate onSubmit={handleFormSubmit}>
      <FadeIn className="tag-fields">
        <FormControl>
          <div className="input-and-select-list-wrapper">
            <Input
              type="text"
              variant="soft"
              size="lg"
              placeholder="@ArtistName"
              value={artistQuery}
              autoComplete="search"
              onChange={handleArtistChange}
              disabled={taggedArtists.length === maxTaggedArtists}
            />
            <SelectList
              items={artistSearchResults.slice(0, 5)}
              renderItem={(artist: Artist) => asTag(artist.name, "@")}
              onSelect={handleArtistSelect}
              loading={isSearchingArtists}
            />
          </div>

          <ChipList
            items={taggedArtists}
            renderItem={(artist: Artist) => <span>{asTag(artist.name, "@")}</span>}
            onDelete={handleDeleteArtistTag}
          />
        </FormControl>

        {tagsError !== "" && (
          <FormControl error>
            <FormHelperText>{tagsError}</FormHelperText>
          </FormControl>
        )}
      </FadeIn>

      <FadeIn>
        <FormControl error={titleField.error !== ""} id="post-title">
          <Input
            variant="soft"
            size="lg"
            placeholder="Post title (optional)"
            autoComplete="off"
            value={titleField.value}
            onChange={handleTitleChange}
          />
          {titleField.error !== "" && <FormHelperText>{titleField.error}</FormHelperText>}
        </FormControl>
      </FadeIn>

      <FadeIn>
        <FormControl error={editorError !== ""}>
          <div ref={editorRef}/>
          {editorError !== "" && <FormHelperText>{editorError}</FormHelperText>}
        </FormControl>
      </FadeIn>

      <FadeIn>
        <AnimatedButton className="filling">
          <button
            className={classNames("button", { "filling loading": isSubmittingForm })}
            disabled={tagsError !== "" || titleField.error !== "" || editorError !== ""}
          >
            {isSubmittingForm && <ButtonLoader/>}
            <span>Save & Preview</span>
          </button>
        </AnimatedButton>
      </FadeIn>
    </form>
  )

  function renderContents(children: ReactNode) {
    return (
      <div className="page compose">
        <main className="container">
          {children}
        </main>
      </div>
    )
  }
}
