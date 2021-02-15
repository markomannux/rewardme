import { useEffect } from "react"
import StoreService from "../services/store-service"
import DatabaseService from "../services/database-service"

export default function useStore(storeService: StoreService<any>, handler: any) {
  const  databaseService = DatabaseService()

  useEffect(() => {
    handler()
    
    storeService.on('item:added', handler)
    storeService.on('item:updated', handler)
    storeService.on('item:deleted', handler)
    databaseService.on('database:reset', handler)

    return () => {
      storeService.off('item:added', handler)
      storeService.off('item:updated', handler)
      storeService.off('item:deleted', handler)
      databaseService.off('database:reset', handler)
    }
  }, [])
}