import EventEmitter from 'events';
import { openDB } from 'idb'
import { DB_USERDATA } from './database-service';
import { v4 as uuidv4 } from 'uuid';

interface Storable {
    id?: string
}

export default class StoreService<T extends Storable> extends EventEmitter {

    storeName: string

    constructor(storeName: string) {
        super()
        this.storeName = storeName 
    }

    open = async () => {
        return await openDB(DB_USERDATA, 1)
    }

    list = async () : Promise<T[]> => {
        const db1 = await this.open();
        return db1.getAll(this.storeName)
    }

    listFromIndex = async (indexName: string, value: any) : Promise<T[]> => {
        const db1 = await this.open();
        return db1.getAllFromIndex(this.storeName, indexName, value)
    }

    get = async (id: string) : Promise<T> => {
        const db1 = await this.open();
        return db1.get(this.storeName, id)
    }

    add = async (item: T) => {
        const db1 = await this.open();
        item.id = uuidv4()
        db1.add(this.storeName, item, item.id)
        this.emit(`item:added`)
        db1.close();
    }

    addAll = async (items: T[]) => {
        const db1 = await this.open();

        for (const item of items) {
            db1.add(this.storeName, item, item.id)    
        }
        db1.close();
    }

    upsert = async (item: T) => {
        const db1 = await this.open();
        if (item.id) {
            await this.update(item)
        } else {
            await this.add(item)
        }
        db1.close();
    }

    update = async (item: T) => {
        const db1 = await this.open();
        db1.put(this.storeName, item, item.id)
        this.emit(`item:updated`)
        db1.close();
    }

    delete = async (item: T) => {
        const db1 = await this.open();
        if (item.id) {
            await db1.delete(this.storeName, item.id)
            this.emit(`item:deleted`)
        }
        db1.close();
    }
}