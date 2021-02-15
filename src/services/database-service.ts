import EventEmitter from 'events'
import { deleteDB, openDB } from 'idb'
import { STORE_ACHIEVEMENTS } from './achievement-service'
import { STORE_CONFIG } from './config-service'
import { STORE_REWARDS } from './reward-service'
import { STORE_TASKS } from './task-service'

const DB_USERDATA = 'userdata'

class DatabaseService extends EventEmitter {

    init = async () => {
        console.log('initializing db');
        const db1 = await openDB(DB_USERDATA, 1, {
            upgrade(db) {
                const achievementStore = db.createObjectStore(STORE_ACHIEVEMENTS)
                achievementStore.createIndex('spentIndex', 'spent')
                achievementStore.createIndex('dateIndex', 'date')
                achievementStore.createIndex('rewardSpentIndex', ['reward.id', 'spent'])
                db.createObjectStore(STORE_TASKS)
                db.createObjectStore(STORE_REWARDS)
                db.createObjectStore(STORE_CONFIG)
            }
        })

        console.log('db initialized');
        this.emit(`database:initialized`)
        db1.close()
    }

    clear = async () => {
        console.log('clear db');
        if (window.confirm('This will clear all data. Continue?')) {
        await deleteDB(DB_USERDATA, {
            blocked() {
                console.log('blocked?')
            }
        })
        console.log('db cleared');
        this.emit(`database:cleared`)
        }
    }

    reset = async () => {
        await this.clear()
        await this.init()
        console.log('database reset')
        this.emit(`database:reset`)
    }
}

let databaseService: DatabaseService

export default () => {
    if (!databaseService) {
        databaseService = new DatabaseService()
    }
    return databaseService
}

export {
    DB_USERDATA
}