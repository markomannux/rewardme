import { useState } from "react"

/*
 * This hook mantain the status about undoable actions
 */
type UndoActionHook = (undoHandler: Function) => [boolean, () => void, () => void, any, () => void]
const useUndoAction: UndoActionHook = (undoHandler: Function) => {
  
  const [shown, setShown] = useState(false)
  const [undoItem, setUndoItem] = useState()

  const show = () => {
    setShown(true)
  }

  const hide = () => {
    setShown(false)
  }

  const undo = () => {
    undoHandler(undoItem)
  }

  return [shown, show, hide, setUndoItem, undo]
}

export default useUndoAction