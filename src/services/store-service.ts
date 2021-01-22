import EventEmitter from 'events';
import { openDB } from 'idb'
import { DB_USERDATA } from './database-service';

interface Storable {
    id: string
}

export default class StoreService<T extends Storable> extends EventEmitter {

    storeName: string

    constructor(storeName: string) {
        super()
        this.storeName = storeName 
    }

    list = async () : Promise<T[]> => {
        const db1 = await openDB(DB_USERDATA, 1);
        return db1.getAll(this.storeName)
    }

    get = async (id: string) : Promise<T> => {
        const db1 = await openDB(DB_USERDATA, 1);
        return db1.get(this.storeName, id)
    }

    add = async (item: T) => {
        const db1 = await openDB(DB_USERDATA, 1);
        db1.add(this.storeName, item, item.id)
        this.emit(`${this.storeName}:added`)
        db1.close();
    }

    addAll = async (items: T[]) => {
        const db1 = await openDB(DB_USERDATA, 1);

        for (const item of items) {
            db1.add(this.storeName, item, item.id)    
        }
        db1.close();
    }
}