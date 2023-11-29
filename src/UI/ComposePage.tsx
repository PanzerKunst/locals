/* eslint-disable */

import { Search } from "@mui/icons-material"
import { FormControl, FormHelperText, Input } from "@mui/joy"
import _isEmpty from "lodash/isEmpty"
import Quill from "quill"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { Field } from "../Util/FormUtils.ts"

import "./ComposePage.scss"
import { LocationSelectList } from "./_CommonComponents/LocationSelectList.tsx"

// Only necessary to avoid double-mount in dev mode
let hasMounted = false

export function ComposePage() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [titleField, setTitleField] = useState<Field>({ value: "", error: "" })
  const [editorFieldError, setEditorFieldError] = useState("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  function getContent(): string {
    return editorRef.current!.querySelector(".ql-editor")!.innerHTML
  }

  function isTitleValid(): boolean {
    const { value } = titleField

    if (value === "") {
      setTitleField({ value, error: "Cannot be empty" })
      return false
    }

    return true
  }

  function isEditorValid(): boolean {
    const content = getContent()

    if (content === "<p><br></p>") {
      setEditorFieldError("Cannot be empty")
      return false
    }

    return true
  }

  function isFormValid(): boolean {
    return isTitleValid() && isEditorValid()
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
    console.log("Submitting content:", getContent())

    setIsSubmittingForm(false)
  }

  useEffect(() => {
    if (hasMounted || !editorRef.current) {
      return
    }

    new Quill(editorRef.current, {
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

    hasMounted = true
  }, [])

  return (
    <div className="page compose">
      <main className="container">
        <form noValidate onSubmit={handleFormSubmit}>
          {/* <FadeIn>
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
                  startDecorator={<Search/>}
                />
                {(isSearchingLocations || !_isEmpty(locationSearchResults)) && (
                  <LocationSelectList locations={locationSearchResults} onSelect={handleLocationSelect} loading={isSearchingLocations}/>
                )}
              </div>
              {locationFieldError !== "" && <FormHelperText>{locationFieldError}</FormHelperText>}
            </FormControl>
          </FadeIn> */}

          <FadeIn>
            <FormControl error={titleField.error !== ""}>
              <Input
                variant="soft"
                size="lg"
                placeholder="Post title"
                value={titleField.value}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
              />
              {titleField.error !== "" && <FormHelperText>{titleField.error}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn>
            <FormControl error={editorFieldError !== ""}>
              <div ref={editorRef}/>
              {editorFieldError !== "" && <FormHelperText>{editorFieldError}</FormHelperText>}
            </FormControl>
          </FadeIn>

          <FadeIn>
            <AnimatedButton className="filling">
              <button className="button" disabled={titleField.error !== "" || editorFieldError !== ""}>
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
