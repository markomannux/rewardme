import { useState } from "react"

/*
 * This hook mantain the status about undoable actions
 */
type UndoActionHook = (undoItem: any, undoHandler: Function) => [boolean, () => void, () => void, () => void]
const useUndoAction: UndoActionHook = (undoItem: any, undoHandler: Function) => {
  
  const [shown, setShown] = useState(false)

  const show = () => {
    setShown(true)
  }

  const hide = () => {
    setShown(false)
  }

  const undo = () => {
    undoHandler(undoItem)
  }

  return [shown, show, hide, undo]
}

export default useUndoAction