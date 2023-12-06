import Quill from "quill"

export function isEditorEmpty(quill: Quill | undefined) {
  return quill?.getText().trim() === ""
}
