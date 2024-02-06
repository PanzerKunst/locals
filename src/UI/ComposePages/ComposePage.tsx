import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormControl, FormHelperText, Input } from "@mui/joy"
import classNames from "classnames"
import { motion } from "framer-motion"
import _head from "lodash/head"
import _isEmpty from "lodash/isEmpty"
import _sample from "lodash/sample"
import Quill, { Sources } from "quill"
import Delta from "quill-delta"
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { ActionableChipList } from "../_CommonComponents/ActionableChipList.tsx"
import { useHeaderTitle } from "../_CommonComponents/AppHeader/AppHeader.ts"
import { ButtonLoader } from "../_CommonComponents/ButtonLoader.tsx"
import { CircularLoader } from "../_CommonComponents/CircularLoader.tsx"
import { SelectList } from "../_CommonComponents/SelectList.tsx"
import { InputTooltip } from "../_CommonComponents/Tooltip/InputTooltip.tsx"
import { VideoPlayer } from "../_CommonComponents/VideoPlayer.tsx"
import { useAppContext } from "../../AppContext.tsx"
import { storeArtists } from "../../Data/Backend/Apis/ArtistsApi.ts"
import { deleteFile, deleteVideo, uploadBase64Image, uploadFormDataFile } from "../../Data/Backend/Apis/FileApi.ts"
import { fetchPostOfId, storePost, updatePost } from "../../Data/Backend/Apis/PostsApi.ts"
import { Artist } from "../../Data/Backend/Models/Artist.ts"
import { PostWithTags } from "../../Data/Backend/Models/PostWithMore.ts"
import { searchArtists } from "../../Data/Spotify/Apis/SearchApi.ts"
import { scrollIntoView } from "../../Util/BrowserUtils.ts"
import { isEditorEmpty } from "../../Util/QuillUtils.ts"
import { useDebounce } from "../../Util/ReactUtils.ts"
import { getPostWithTagsFromSession, savePostWithTagsInSession } from "../../Util/SessionStorage.ts"
import { Field, isBase64, isOnlyDigitsAndNotEmpty } from "../../Util/ValidationUtils.ts"
import { config } from "../../config.ts"
import { AppUrlQueryParam } from "../../Util/AppUrlQueryParams.ts"

import s from "/src/UI/_CommonStyles/_exports.module.scss"
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

  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const [heroImagePath, setHeroImagePath] = useState<string>()

  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const heroVideoInputRef = useRef<HTMLInputElement>(null)
  const [isHeroVideoUploading, setIsHeroVideoUploading] = useState(false)
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>()

  const editorRef = useRef<HTMLDivElement>(null)
  const [quill, setQuill] = useState<Quill>()
  const [editorError, setEditorError] = useState("")
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  useHeaderTitle("Compose")

  useEffect(() => {
    if (!appContext.loggedInUser) {
      navigate(`/?${AppUrlQueryParam.ACCESS_ERROR}`, { replace: true })
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
          [{ "header": [2, false] }],
          ["bold", "italic", "strike"],
          ["link", "image", "video"],
          ["blockquote"],
          ["clean"]
        ]
      }
    })

    setQuill(quillEditor)

    const postWithTags = getPostWithTagsFromSession()

    if (postWithTags) {
      initFormData(postWithTags)
    } else if (isOnlyDigitsAndNotEmpty(postId)) {
      void initFormDataFromPostId(Number(postId))
    }

    async function initFormDataFromPostId(postId: number) {
      const postWithAuthorAndTags = await fetchPostOfId(postId)

      if (!postWithAuthorAndTags) {
        return
      }

      initFormData(postWithAuthorAndTags)
    }

    function initFormData(postWithTags: PostWithTags) {
      setTitleField({
        value: postWithTags.post.title || "",
        error: "" // We reset any eventual errors
      })

      setTaggedArtists(postWithTags.taggedArtists)
      setHeroImagePath(postWithTags.post.heroImagePath)
      setHeroVideoUrl(postWithTags.post.heroVideoUrl)
      quillEditor.root.innerHTML = postWithTags.post.content
    }
  }, [postId, quill])

  useEffect(() => {
    if (!quill) {
      return
    }

    async function handleTextChange(delta: Delta, _oldContents: Delta, source: Sources) {
      setEditorError("") // We reset any eventual errors

      if (!quill || source !== "user") {
        return
      }

      for (const op of delta.ops) {
        // @ts-ignore TS2339: Property image does not exist on type string | Record<string, unknown>
        const image = op.insert?.image as string

        if (!isBase64(image)) {
          continue
        }

        quill.history.undo() // Prevent default image insertion

        const filePath = await uploadBase64Image(image)
        const fileUrl = `${config.BACKEND_URL}/file/${filePath}`

        const cursorPosition = quill.getSelection()?.index || 0
        quill.insertEmbed(cursorPosition, "image", fileUrl)
      }
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
      const matchingArtists = await storeArtists(searchResults)
      setArtistSearchResults(matchingArtists)

      setIsSearchingArtists(false)
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
      setTagsError("Tag at least 1 artist")
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

  const handleBrowseHeroImageClick = () => {
    heroImageInputRef.current?.click()
  }

  const handleHeroImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = _head(event.target.files)

    if (!file) {
      return
    }

    void handleHeroVideoDelete()

    const filePath = await uploadFormDataFile(file)
    setHeroImagePath(filePath)
  }

  const handleHeroImageDelete = async () => {
    if (!heroImagePath) {
      return
    }

    await deleteFile(heroImagePath)
    setHeroImagePath(undefined)
  }

  const handleBrowseHeroVideoClick = () => {
    heroVideoInputRef.current?.click()
  }

  const handleHeroVideoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = _head(event.target.files)

    if (!file) {
      return
    }

    void handleHeroImageDelete()

    setIsHeroVideoUploading(true)
    const filePath = await uploadFormDataFile(file)
    setIsHeroVideoUploading(false)
    setHeroVideoUrl(`${config.BACKEND_URL}/file/${filePath}`)
  }

  const handleHeroVideoUrlSubmitted = (value: string) => {
    void handleHeroImageDelete()

    setIsTooltipVisible(false)
    setHeroVideoUrl(value)
  }

  const handleHeroVideoDelete = async () => {
    if (!heroVideoUrl) {
      return
    }

    await deleteVideo(heroVideoUrl)
    setHeroVideoUrl(undefined)
  }

  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      return
    }

    setIsSubmittingForm(true)

    let postWithTags = getPostWithTagsFromSession()

    if (!postWithTags && isOnlyDigitsAndNotEmpty(postId)) {
      postWithTags = await fetchPostOfId(Number(postId))
    }

    const storedPostWithTags = postWithTags
      ? await updatePost(postWithTags.post, titleField.value, taggedArtists, heroImagePath, heroVideoUrl, quill!)
      : await storePost(appContext, titleField.value, taggedArtists, heroImagePath, heroVideoUrl, quill!)

    savePostWithTagsInSession(storedPostWithTags)

    navigate("/compose/preview")
  }

  return renderContents(
    <>
      <section className="tag-fields">
        <FormControl error={tagsError !== ""} id="tags">
          <div className="input-and-select-list-wrapper">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
            <Input
              type="text"
              variant="soft"
              size="lg"
              placeholder="Artist Name"
              value={artistQuery}
              autoComplete="search"
              onChange={handleArtistChange}
              disabled={taggedArtists.length === maxTaggedArtists}
            />
            <SelectList
              items={artistSearchResults.slice(0, 5)}
              renderItem={(artist: Artist) => artist.name}
              onSelect={handleArtistSelect}
              loading={isSearchingArtists}
            />
          </div>
          {tagsError !== "" && <FormHelperText>{tagsError}</FormHelperText>}
        </FormControl>

        <ActionableChipList
          items={taggedArtists}
          renderItem={(artist: Artist) => <span>{artist.name}</span>}
          onDelete={handleDeleteArtistTag}
        />
      </section>

      <FormControl error={titleField.error !== ""} id="title" className="form-control-title">
        <Input
          variant="soft"
          size="lg"
          placeholder="Title"
          autoComplete="off"
          value={titleField.value}
          onChange={handleTitleChange}
        />
        {titleField.error !== "" && <FormHelperText>{titleField.error}</FormHelperText>}
      </FormControl>

      <section className="hero-media">
        {!heroImagePath ? (
          <div>
            <span>Hero image</span>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={heroImageInputRef}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onChange={handleHeroImageChange}
              />
              <button className="underlined appears" onClick={handleBrowseHeroImageClick}>Browse</button>
            </div>
          </div>
        ) : (
          <div className="media-wrapper">
            <img src={`${config.BACKEND_URL}/file/${heroImagePath}`} alt="Hero"/>
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ duration: Number(s.animationDurationXs) }}
              className="button icon-only light bordered offset-bg-on-hover"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleHeroImageDelete}
            >
              <FontAwesomeIcon icon={faXmark}/>
            </motion.button>
          </div>
        )}

        <span>or</span>

        {!heroVideoUrl && (
          <div>
            <span>Hero video</span>
            {!isHeroVideoUploading ? (
              <div>
                {isTooltipVisible && (
                  <InputTooltip onClose={() => setIsTooltipVisible(false)} onSubmit={handleHeroVideoUrlSubmitted} position="bottom"/>
                )}
                <button className="underlined appears" onClick={() => setIsTooltipVisible(true)}>From link</button>
                <span>or</span>
                <input
                  type="file"
                  accept="video/*"
                  ref={heroVideoInputRef}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={handleHeroVideoChange}
                />
                <button className="underlined appears" onClick={handleBrowseHeroVideoClick}>Browse</button>
              </div>
            ) : (
              <CircularLoader/>
            )}
          </div>
        )}

        {heroVideoUrl && (
          <div className="media-wrapper">
            <VideoPlayer url={heroVideoUrl}/>
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ duration: Number(s.animationDurationXs) }}
              className="button icon-only light bordered offset-bg-on-hover"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={handleHeroVideoDelete}
            >
              <FontAwesomeIcon icon={faXmark}/>
            </motion.button>
          </div>
        )}
      </section>

      <FormControl error={editorError !== ""} id="editor">
        <div ref={editorRef}/>
        {editorError !== "" && <FormHelperText>{editorError}</FormHelperText>}
      </FormControl>

      <div className="button-wrapper">
        <button
          className={classNames("button filled", { loading: isSubmittingForm })}
          disabled={isSubmittingForm || tagsError !== "" || titleField.error !== "" || editorError !== ""}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={handleFormSubmit}
        >
          {isSubmittingForm && <ButtonLoader/>}
          <span>Save & Preview</span>
        </button>
      </div>
    </>
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
