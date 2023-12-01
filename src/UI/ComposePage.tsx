import { Chip, ChipDelete, FormControl, FormHelperText, Input } from "@mui/joy"
import classNames from "classnames"
import _isEmpty from "lodash/isEmpty"
import Quill from "quill"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SelectList } from "./_CommonComponents/SelectList.tsx"
import { useAppContext } from "../AppContext.tsx"
import { fetchAllMusicGenres } from "../Data/Backend/Apis/MusicGenresApi.ts"
import { MusicGenre } from "../Data/Backend/Models/MusicGenre.ts"
import { searchArtists } from "../Data/Spotify/Apis/SearchApi.ts"
import { SpotifyArtist } from "../Data/Spotify/Models/SpotifyArtist.ts"
import { doesHtmlHaveText, Field } from "../Util/FormUtils.ts"
import { useDebounce } from "../Util/ReactUtils.ts"
import { asTagName } from "../Util/TagUtils.ts"

import "./ComposePage.scss"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

const maxTaggedArtists = 2
const maxGenreHashtags = 2

const allMusicGenres: MusicGenre[] = await fetchAllMusicGenres()

export function ComposePage() {
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
  const [editorField, setEditorField] = useState<Field>({ value: "", error: "" })
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  useEffect(() => {
    if (hasMounted || !editorRef.current) {
      return
    }

    const editor = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Compose an epic...",
      formats: ["header", "bold", "italic", "strike", "link", "image", "video", "align", "blockquote"],
      modules: {
        toolbar: [
          [{ "header": [2, 3, false] }],
          ["bold", "italic", "strike"],
          ["link", "image", "video"],
          [{ "align": [] }, "blockquote"],
          ["clean"]
        ]
      }
    })

    function handleTextChange() {
      setEditorField({
        value: editorRef.current!.querySelector(".ql-editor")!.innerHTML,
        error: "" // We reset any eventual errors
      })
    }

    // Register handler
    editor.on("text-change", handleTextChange)

    hasMounted = true

    // Cleanup
    return () => {
      editor.off("text-change", handleTextChange)
    }
  }, [])

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

  function areTagsValid(): boolean {
    if (_isEmpty(taggedSpotifyArtists) && _isEmpty(genreHashtags)) {
      setTagsError("Artist or genre tags are required")
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
    const { value } = editorField

    if (!doesHtmlHaveText(value)) {
      setEditorField({ value, error: "Your post needs some content" })
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
    const { value } = event.target

    setGenreQuery(value)

    const matchingGenres = allMusicGenres.filter((genre) => genre.name.toLowerCase().includes(value.toLowerCase()))
    setGenreSearchResults(matchingGenres)
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

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    // Handle the submission of the content
    // For example, sending it to the backend
    console.log("Submitting content:", editorField.value)

    setIsSubmittingForm(false)
  }

  return (
    <div className="page compose">
      <main className="container">
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
                <ul className="styleless">
                  {taggedSpotifyArtists.map((artist) => (
                    <li key={artist.id}>
                      <Chip
                        size="lg"
                        variant="soft"
                        endDecorator={<ChipDelete onDelete={() => handleDeleteArtistTag(artist)} />}
                      >
                        {asTagName(artist.name, "@")}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>
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
                  items={genreSearchResults.slice(0, 3)}
                  renderItem={(musicGenre) => asTagName(musicGenre.name, "#")}
                  onSelect={handleGenreSelect}
                />
                <ul className="styleless">
                  {genreHashtags.map((musicGenre) => (
                    <li key={musicGenre.id}>
                      <Chip
                        size="lg"
                        variant="soft"
                        endDecorator={<ChipDelete onDelete={() => handleDeleteGenreTag(musicGenre)} />}
                      >
                        {asTagName(musicGenre.name, "#")}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </FormControl>

            {tagsError !== "" && <FormHelperText>{tagsError}</FormHelperText>}
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
            <FormControl error={editorField.error !== ""}>
              <div ref={editorRef}/>
              {editorField.error !== "" && <FormHelperText>{editorField.error}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn>
            <AnimatedButton className="filling">
              <button
                className={classNames("button", { "filling loading": isSubmittingForm })}
                disabled={titleField.error !== "" || editorField.error !== ""}
              >
                {isSubmittingForm && <ButtonLoader/>}
                <span>Save changes</span>
              </button>
            </AnimatedButton>
          </FadeIn>
        </form>
      </main>
    </div>
  )
}
