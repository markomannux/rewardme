import { useState } from "react";


type InfiniteScrollHook = (getCursor: Function, updateResult: Function) => [boolean, () => void] 
const useInfiniteScroll: InfiniteScrollHook = (getCursor: Function, updateResult: Function, max: number = 5) => {

  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0)

  const getScrollableResult = async () => { 

    const fetched = []

    let cursor = await getCursor()

    if (cursor) {
      for (let index = 0; index < offset; index++) {
        if (cursor) {
          cursor = await cursor.continue()
        }
      }
      for (let index = 0; index < max; index++) {
        if(cursor) {
          fetched.push(cursor.value)
          cursor = await cursor.continue()
        }
      }
    }
    setOffset(offset + max)

    if (fetched && fetched.length > 0) {
      updateResult(fetched)
      setDisableInfiniteScroll(fetched.length < max)
    } else {
      setDisableInfiniteScroll(true)
    }
  }

  return [disableInfiniteScroll, getScrollableResult]
}

export default useInfiniteScroll