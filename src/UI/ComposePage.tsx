import { FormControl, FormHelperText, Input } from "@mui/joy"
import classNames from "classnames"
import _isEmpty from "lodash/isEmpty"
import Quill from "quill"
import Delta from "quill-delta"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { ChipList } from "./_CommonComponents/ChipList.tsx"
import { CircularLoader } from "./_CommonComponents/CircularLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SelectList } from "./_CommonComponents/SelectList.tsx"
import { useAppContext } from "../AppContext.tsx"
import { fetchAllMusicGenres } from "../Data/Backend/Apis/MusicGenresApi.ts"
import { fetchPost, storePost, updatePost } from "../Data/Backend/Apis/PostsApi.ts"
import { MusicGenre } from "../Data/Backend/Models/MusicGenre.ts"
import { EmptyPost } from "../Data/Backend/Models/Posts.ts"
import { searchArtists } from "../Data/Spotify/Apis/SearchApi.ts"
import { SpotifyArtist } from "../Data/Spotify/Models/SpotifyArtist.ts"
import { scrollIntoView } from "../Util/AnimationUtils.ts"
import { Field } from "../Util/FormUtils.ts"
import { isEditorEmpty } from "../Util/QuillUtils.ts"
import { useDebounce } from "../Util/ReactUtils.ts"
import { getEmptyPostFromSession, saveEmptyPostInSession } from "../Util/SessionStorage.ts"
import { asTagName } from "../Util/TagUtils.ts"


import "./ComposePage.scss"

let quill: Quill

const maxTaggedArtists = 2
const maxGenreHashtags = 2

export function ComposePage() {
  const navigate = useNavigate()
  const appContext = useAppContext()

  const [artistQuery, setArtistQuery] = useState("")
  const debouncedArtistQuery = useDebounce(artistQuery, 300)
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const [artistSearchResults, setArtistSearchResults] = useState<SpotifyArtist[]>([])
  const [taggedSpotifyArtists, setTaggedSpotifyArtists] = useState<SpotifyArtist[]>([])

  const [genreQuery, setGenreQuery] = useState("")
  const [genreSearchResults, setGenreSearchResults] = useState<MusicGenre[]>([])
  const [genreHashtags, setGenreHashtags] = useState<MusicGenre[]>([])

  const [tagsError, setTagsError] = useState("")

  const editorRef = useRef<HTMLDivElement>(null)
  const [titleField, setTitleField] = useState<Field>({ value: "", error: "" })
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

    quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Compose an epic...",
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

    const emptyPost = getEmptyPostFromSession()

    if (emptyPost) {
      initQuillContent(emptyPost)
    }

    async function initQuillContent(emptyPost: EmptyPost) {
      const post = await fetchPost(emptyPost.id)

      if (!post) {
        return
      }

      quill.root.innerHTML = post.content
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
  }, [allMusicGenresQuery.data])

  useEffect(() => {
    async function performArtistSearch() {
      setIsSearchingArtists(true)
      const queryWithoutAtSign = debouncedArtistQuery.replace("@", "")
      const searchResults = await searchArtists(appContext, queryWithoutAtSign)
      setIsSearchingArtists(false)
      setArtistSearchResults(searchResults)
    }

    setArtistSearchResults([])

    if (debouncedArtistQuery === "") {
      setIsSearchingArtists(false)
      return
    }

    performArtistSearch()
  }, [appContext, debouncedArtistQuery, taggedSpotifyArtists])

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
    if (_isEmpty(taggedSpotifyArtists) && _isEmpty(genreHashtags)) {
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
      return false
    }

    return true
  }

  function isEditorValid(): boolean {
    if (isEditorEmpty(quill)) {
      setEditorError("Your post needs some content")
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

  const handleArtistSelect = (spotifyArtist: SpotifyArtist) => {
    if (taggedSpotifyArtists.length < maxTaggedArtists && !taggedSpotifyArtists.some(artist => artist.id === spotifyArtist.id)) {
      setTaggedSpotifyArtists([...taggedSpotifyArtists, spotifyArtist])
    }

    setArtistQuery("")
    setTagsError("")
  }

  const handleDeleteArtistTag = (spotifyArtist: SpotifyArtist) => {
    setTaggedSpotifyArtists(taggedSpotifyArtists.filter((taggedArtist) => taggedArtist.id !== spotifyArtist.id))
  }

  const handleGenreChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGenreQuery(event.target.value)
  }

  const handleGenreSelect = (musicGenre: MusicGenre) => {
    if (genreHashtags.length < maxGenreHashtags && !genreHashtags.some(genre => genre.id === musicGenre.id)) {
      setGenreHashtags([...genreHashtags, musicGenre])
    }

    setGenreQuery("")
    setTagsError("")
  }

  const handleDeleteGenreTag = (musicGenre: MusicGenre) => {
    setGenreHashtags(genreHashtags.filter((taggedGenre) => taggedGenre.id !== musicGenre.id))
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

    const emptyPost = getEmptyPostFromSession()

    if (emptyPost) {
      await updatePost(emptyPost, quill)
    } else {
      const storedPost = await storePost(appContext, titleField.value, quill)

      saveEmptyPostInSession({
        id: storedPost.id,
        createdAt: storedPost.createdAt,
        updatedAt: storedPost.updatedAt,
        publishedAt: storedPost.publishedAt,
        userId: storedPost.userId,
        title: storedPost.title
      })
    }

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
              disabled={taggedSpotifyArtists.length === maxTaggedArtists}
            />
            <SelectList
              items={artistSearchResults.slice(0, 5)}
              renderItem={(artist) => asTagName(artist.name, "@")}
              onSelect={handleArtistSelect}
              loading={isSearchingArtists}
            />
          </div>

          <ChipList
            items={taggedSpotifyArtists}
            renderItem={(spotifyArtist) => <span>{asTagName(spotifyArtist.name, "@")}</span>}
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
              disabled={genreHashtags.length === maxGenreHashtags}
            />
            <SelectList
              items={genreSearchResults.slice(0, 5)}
              renderItem={(musicGenre) => asTagName(musicGenre.name, "#")}
              onSelect={handleGenreSelect}
            />
          </div>

          <ChipList
            items={genreHashtags}
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
        <FormControl error={titleField.error !== ""}>
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
