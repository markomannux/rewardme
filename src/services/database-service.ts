import { deleteDB, openDB } from 'idb'
import { STORE_ACHIEVEMENTS } from './achievement-service'
import { STORE_REWARDS } from './reward-service'
import { STORE_TASKS } from './task-service'

const DB_USERDATA = 'userdata'

const init = async () => {
    const db1 = await openDB(DB_USERDATA, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_ACHIEVEMENTS)
            db.createObjectStore(STORE_TASKS)
            db.createObjectStore(STORE_REWARDS)
        }
    })

    db1.close()
}

const clear = async () => {
    console.log('clear db');
    if (window.confirm('This will clear all data. Continue?')) {
      await deleteDB(DB_USERDATA)
    }
}

export {
    DB_USERDATA,
    init,
    clear
}