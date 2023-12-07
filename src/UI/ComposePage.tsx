import { FormControl, FormHelperText, Input } from "@mui/joy"
import classNames from "classnames"
import _isEmpty from "lodash/isEmpty"
import _sample from "lodash/sample"
import Quill from "quill"
import Delta from "quill-delta"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { ChipList } from "./_CommonComponents/ChipList.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SelectList } from "./_CommonComponents/SelectList.tsx"
import { useAppContext } from "../AppContext.tsx"
import { storeArtists } from "../Data/Backend/Apis/ArtistsApi.ts"
import { fetchAllMusicGenres } from "../Data/Backend/Apis/MusicGenresApi.ts"
import { fetchPost, storePost, updatePost } from "../Data/Backend/Apis/PostsApi.ts"
import { Artist } from "../Data/Backend/Models/Artist.ts"
import { MusicGenre } from "../Data/Backend/Models/MusicGenre.ts"
import { EmptyPostWithTags } from "../Data/Backend/Models/PostWithTags.ts"
import { searchArtists } from "../Data/Spotify/Apis/SearchApi.ts"
import { scrollIntoView } from "../Util/BrowserUtils.ts"
import { isEditorEmpty } from "../Util/QuillUtils.ts"
import { useDebounce } from "../Util/ReactUtils.ts"
import { getEmptyPostWithTagsFromSession, saveEmptyPostWithTagsInSession } from "../Util/SessionStorage.ts"
import { asTagName } from "../Util/TagUtils.ts"
import { Field, isOnlyDigitsAndNotEmpty } from "../Util/ValidationUtils.ts"

import "./ComposePage.scss"

const maxTaggedArtists = 2
const maxGenreHashtags = 2

const editorPlaceholders = [
  "Compose an epic...",
  "Always be authentic..."
]

export function ComposePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()
  const { postId } = useParams()

  const [artistQuery, setArtistQuery] = useState("")
  const debouncedArtistQuery = useDebounce(artistQuery, 300)
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const [artistSearchResults, setArtistSearchResults] = useState<Artist[]>([])
  const [taggedArtists, setTaggedArtists] = useState<Artist[]>([])

  const [genreQuery, setGenreQuery] = useState("")
  const [genreSearchResults, setGenreSearchResults] = useState<MusicGenre[]>([])
  const [taggedGenres, setTaggedGenres] = useState<MusicGenre[]>([])

  const [tagsError, setTagsError] = useState("")

  const [titleField, setTitleField] = useState<Field>({ value: "", error: "" })
  const editorRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<Quill>()
  const [editorError, setEditorError] = useState("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const allMusicGenresQuery = useQuery(
    "allMusicGenres",
    () => fetchAllMusicGenres()
  )

  useEffect(() => {
    if (quill || !editorRef.current || !allMusicGenresQuery.data) {
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
      initQuillContent(emptyPostWithTags.post.id)
    } else if (isOnlyDigitsAndNotEmpty(postId)) {
      initPostFromId(Number(postId))
    }

    function initPostTitleAndTags(emptyPostWithTags: EmptyPostWithTags) {
      setTitleField({
        value: emptyPostWithTags.post.title,
        error: "" // We reset any eventual errors
      })

      setTaggedArtists(emptyPostWithTags.taggedArtists)
      setTaggedGenres(emptyPostWithTags.taggedGenres)
    }

    async function initPostFromId(postId: number) {
      const postWithTags = await fetchPost(postId)

      if (!postWithTags) {
        return
      }

      initPostTitleAndTags(postWithTags)
      quillEditor.root.innerHTML = postWithTags.post.content
    }

    async function initQuillContent(postId: number) {
      const postWithTags = await fetchPost(postId)

      if (!postWithTags) {
        return
      }

      quillEditor.root.innerHTML = postWithTags.post.content
    }
  }, [allMusicGenresQuery.data, postId, quill])

  /* TODO: currently unused
  useEffect(() => {
    if (!quill) {
      return
    }

    function handleTextChange(delta: Delta) {
      // TODO: remove
      console.log("handleTextChange", delta)

      setEditorError("") // We reset any eventual errors
    }

    // Register handler
    quill.on("text-change", handleTextChange)

    // Cleanup
    return () => {
      quill.off("text-change", handleTextChange)
    }
  }, [quill]) */

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

    performArtistSearch()
  }, [appContext, debouncedArtistQuery, taggedArtists])

  useEffect(() => {
    setGenreSearchResults([])

    if (genreQuery !== "") {
      const matchingGenres = allMusicGenresQuery.data!.filter((genre) => genre.name.toLowerCase().includes(genreQuery.toLowerCase()))

      // TODO: remove
      console.log("useEffect", genreQuery, matchingGenres)

      setGenreSearchResults(matchingGenres)
    }
  }, [allMusicGenresQuery.data, genreQuery])

  if (allMusicGenresQuery.isLoading) {
    return renderContents(<CircularLoader/>)
  }

  if (allMusicGenresQuery.isError) {
    return renderContents(<span>Error fetching data</span>)
  }

  function areTagsValid(): boolean {
    if (_isEmpty(taggedArtists) && _isEmpty(taggedGenres)) {
      setTagsError("Add at least 1 artist or genre tag")
      scrollIntoView(document.querySelector(".tag-fields")!)
      return false
    }

    return true
  }

  function isTitleValid(): boolean {
    const { value } = titleField

    if (value === "") {
      setTitleField({ value, error: "Your post needs a title" })
      scrollIntoView(document.querySelector("#post-title")!)
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
    return areTagsValid() && isTitleValid() && isEditorValid()
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

  const handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGenreQuery(event.target.value)
  }

  const handleGenreSelect = (musicGenre: MusicGenre) => {
    if (taggedGenres.length < maxGenreHashtags && !taggedGenres.some(genre => genre.id === musicGenre.id)) {
      setTaggedGenres([...taggedGenres, musicGenre])
    }

    setGenreQuery("")
    setTagsError("")
  }

  const handleDeleteGenreTag = (musicGenre: MusicGenre) => {
    setTaggedGenres(taggedGenres.filter((taggedGenre) => taggedGenre.id !== musicGenre.id))
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setTitleField({
      value,
      error: "" // We reset any eventual errors
    })
  }

  const handleTitleBlur = () => {
    return isTitleValid()
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    let emptyPostWithTags = getEmptyPostWithTagsFromSession()

    if (!emptyPostWithTags && isOnlyDigitsAndNotEmpty(postId)) {
      emptyPostWithTags = await fetchPost(Number(postId))
    }

    const storedEmptyPostWithTags = emptyPostWithTags
      ? await updatePost(emptyPostWithTags.post, titleField.value, taggedArtists, taggedGenres, quill!)
      : await storePost(appContext, titleField.value, taggedArtists, taggedGenres, quill!)

    saveEmptyPostWithTagsInSession(storedEmptyPostWithTags)

    navigate("/compose/preview")
  }

  return renderContents(
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
              renderItem={(artist: Artist) => asTagName(artist.name, "@")}
              onSelect={handleArtistSelect}
              loading={isSearchingArtists}
            />
          </div>

          <ChipList
            items={taggedArtists}
            renderItem={(artist: Artist) => <span>{asTagName(artist.name, "@")}</span>}
            onDelete={handleDeleteArtistTag}
          />
        </FormControl>

        <FormControl>
          <div className="input-and-select-list-wrapper">
            <Input
              type="text"
              variant="soft"
              size="lg"
              placeholder="#genre"
              value={genreQuery}
              autoComplete="search"
              onChange={handleGenreChange}
              disabled={taggedGenres.length === maxGenreHashtags}
            />
            <SelectList
              items={genreSearchResults.slice(0, 5)}
              renderItem={(musicGenre) => asTagName(musicGenre.name, "#")}
              onSelect={handleGenreSelect}
            />
          </div>

          <ChipList
            items={taggedGenres}
            renderItem={(musicGenre) => <span>{asTagName(musicGenre.name, "#")}</span>}
            onDelete={handleDeleteGenreTag}
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
            placeholder="Post title"
            autoComplete="off"
            value={titleField.value}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
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
