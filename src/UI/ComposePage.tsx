import { Search } from "@mui/icons-material"
import { FormControl, FormHelperText, Input } from "@mui/joy"
import _isEmpty from "lodash/isEmpty"
import Quill from "quill"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { SelectList } from "./_CommonComponents/SelectList.tsx"
import { useAppContext } from "../AppContext.tsx"
import { searchArtists } from "../Data/Spotify/Apis/SearchApi.ts"
import { SpotifyArtist } from "../Data/Spotify/Models/SpotifyArtist.ts"
import { doesHtmlHaveText, Field } from "../Util/FormUtils.ts"
import { useDebounce } from "../Util/ReactUtils.ts"

import "./ComposePage.scss"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

export function ComposePage() {
  const appContext = useAppContext()

  const [artistQuery, setArtistQuery] = useState("")
  const debouncedArtistQuery = useDebounce(artistQuery, 300)
  const [artistFieldError, setArtistFieldError] = useState("")
  const [isSearchingArtists, setIsSearchingArtists] = useState(false)
  const [artistSearchResults, setArtistSearchResults] = useState<SpotifyArtist[]>([])
  const [selectedSpotifyArtist, setSelectedSpotifyArtist] = useState<SpotifyArtist>()

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
      const searchResults = await searchArtists(appContext, debouncedArtistQuery)
      setIsSearchingArtists(false)
      setArtistSearchResults(searchResults)
    }

    setArtistSearchResults([])

    if (_isEmpty(debouncedArtistQuery) || selectedSpotifyArtist) {
      setIsSearchingArtists(false)
      return
    }

    performArtistSearch()
  }, [appContext, debouncedArtistQuery, selectedSpotifyArtist])

  function isArtistInputValid(): boolean {
    if (!selectedSpotifyArtist) {
      setArtistFieldError("Who are you writing about?")
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
    return isArtistInputValid() && isTitleValid() && isEditorValid()
  }

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtistQuery(event.target.value)
    setSelectedSpotifyArtist(undefined)
  }

  const handleArtistBlur = () => {
    isArtistInputValid()
  }

  const handleArtistSelect = (spotifyArtist: SpotifyArtist) => {
    setSelectedSpotifyArtist(spotifyArtist)
    setArtistQuery(spotifyArtist.name)
    setArtistFieldError("")
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
          <FadeIn>
            <FormControl error={artistFieldError !== ""}>
              <div className="artist-input-and-dropdown">
                <Input
                  type="text"
                  variant="soft"
                  size="lg"
                  placeholder="Artist name"
                  value={artistQuery}
                  autoComplete="search"
                  onChange={handleArtistChange}
                  onBlur={handleArtistBlur}
                  startDecorator={<Search/>}
                />
                {(isSearchingArtists || !_isEmpty(artistSearchResults)) && (
                  <SelectList
                    items={artistSearchResults.slice(0, 5)}
                    renderItem={(artist) => artist.name}
                    onSelect={handleArtistSelect}
                    loading={isSearchingArtists}
                  />
                )}
              </div>
              {artistFieldError !== "" && <FormHelperText>{artistFieldError}</FormHelperText>}
            </FormControl>
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
              <button className="button" disabled={titleField.error !== "" || editorField.error !== ""}>
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
