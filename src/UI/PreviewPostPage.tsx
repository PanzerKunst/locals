import { ReactNode } from "react"

import { ErrorSnackbar } from "./_CommonComponents/Snackbar/ErrorSnackbar.tsx"
import { getEditorContentFromSession } from "../Util/SessionStorage.ts"

import "./PreviewPostPage.scss"

export function PreviewPostPage() {
  const editorContent = getEditorContentFromSession()

  if (!editorContent) {
    return renderContents(<ErrorSnackbar message="Content is missing"/>)
  }

  return (
    <div className="page preview-post">
      <main className="container">
        <div id="quill-preview" dangerouslySetInnerHTML={{ __html: editorContent }}/>
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
