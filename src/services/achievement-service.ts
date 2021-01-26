import Achievement from '../model/Achievement'
import Reward from '../model/Reward';
import StoreService from './store-service';

const STORE_ACHIEVEMENTS = 'achievements'

class AchievementService extends StoreService<Achievement> {

    spendableRewards = async (): Promise<[Reward, number][]> => {
        const db1 = await this.open() 
        const index = db1.transaction(this.storeName).store.index('spentIndex')
        let cursor = await index.openCursor('n');
        const res: [Reward, number][] = []
        const rewardMap: {[key: string]: [Reward, number]} = {}
        while (true) {
            if (cursor) {
                if (!rewardMap[cursor.value.reward.id]) {
                    rewardMap[cursor.value.reward.id] = [cursor.value.reward, 0]
                    res.push(rewardMap[cursor.value.reward.id])
                }
                rewardMap[cursor.value.reward.id][1]++
                cursor = await cursor?.continue()
            } else break
        }
        return new Promise((resolve, reject) => {
            resolve(res)
        })
    }

    spendReward = async (reward: Reward) => {
        const db1 = await this.open() 
        const index = db1.transaction(this.storeName).store.index('rewardSpentIndex')
        
        if (reward.id) {
            const spendableAchievement = await index.get([reward.id, 'n'])
            spendableAchievement.spent = 'y'
            this.update(spendableAchievement)
        }
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