import classNames from "classnames"
import { ReactNode, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AnimatedButton } from "./_CommonComponents/AnimatedButton.tsx"
import { ButtonLoader } from "./_CommonComponents/ButtonLoader.tsx"
import { FadeIn } from "./_CommonComponents/FadeIn.tsx"
import { ErrorSnackbar } from "./_CommonComponents/Snackbar/ErrorSnackbar.tsx"
import { actionsFromAppUrl, appUrlQueryParam } from "../Util/AppUrlQueryParams.ts"
import { getEditorContentFromSession, saveEditorContentInSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)
  const editorContent = getEditorContentFromSession()

  if (!editorContent) {
    return renderContents(<ErrorSnackbar message="Content is missing"/>)
  }

  const handleClick = () => {
    setIsPublishing(true)
    saveEditorContentInSession(undefined)
    navigate(`/home?${appUrlQueryParam.ACTION}=${actionsFromAppUrl.PUBLICATION_SUCCESS}`)
  }

  return (
    <div className="page preview-post">
      <main className="container">
        <div id="quill-preview" dangerouslySetInnerHTML={{ __html: editorContent }}/>

        <FadeIn>
          <AnimatedButton className="filling">
            <button className={classNames("button", { "filling loading": isPublishing })} onClick={handleClick}>
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
