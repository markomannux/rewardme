import { useState } from "react";


type InfiniteScrollHook = (getCursor: Function, updateResult: Function) => [boolean, () => void] 
const useInfiniteScroll: InfiniteScrollHook = (getCursor: Function, updateResult: Function) => {

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
      for (let index = 0; index < 5; index++) {
        if(cursor) {
          fetched.push(cursor.value)
          cursor = await cursor.continue()
        }
      }
    }
    setOffset(offset + 5)

    if (fetched && fetched.length > 0) {
      updateResult(fetched)
      setDisableInfiniteScroll(fetched.length < 5)
    } else {
      setDisableInfiniteScroll(true)
    }
  }

  return [disableInfiniteScroll, getScrollableResult]
}

export default useInfiniteScroll