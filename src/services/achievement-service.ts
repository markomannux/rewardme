import Achievement from '../model/Achievement'
import StoreService from './store-service';

const STORE_ACHIEVEMENTS = 'achievements'

class AchievementService extends StoreService<Achievement> {

    spendableRewards = async (): Promise<Achievement[]> => {
        const db1 = await this.open() 
        const index = db1.transaction(this.storeName).store.index('spentIndex')
        let cursor = await index.openCursor('n');
        const res: Achievement[] = []
        while (true) {
            if (cursor) {
                res.push(cursor.value)
                cursor = await cursor?.continue()
            } else break
        }
        return new Promise((resolve, reject) => {
            resolve(res)
        })
    }
}


let service: AchievementService


export default () => {
    if (!service) {
        service = new AchievementService(STORE_ACHIEVEMENTS)
    }
    return service
}

export {
    STORE_ACHIEVEMENTS
}