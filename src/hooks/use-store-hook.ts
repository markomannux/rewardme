import { useEffect } from "react"
import StoreService from "../services/store-service"

export default function useStore(storeService: StoreService<any>, handler: any) {
  useEffect(() => {
    handler()
    
    storeService.on('item:added', handler)
    storeService.on('item:updated', handler)
    storeService.on('item:deleted', handler)

    return () => {
      storeService.off('item:added', handler)
      storeService.off('item:updated', handler)
      storeService.off('item:deleted', handler)
    }
  }, [])
}