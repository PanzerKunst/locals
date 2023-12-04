import Quill from "quill"

export function isEditorEmpty(quill: Quill) {
  return quill.getLength() === 1
}
