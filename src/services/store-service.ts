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

    withOpenConnection = async (fn: Function) => {
        const db1 = await this.open();
        const res = fn(db1)
        db1.close()
        return res
    }

    open = async () => {
        return await openDB(DB_USERDATA, 1)
    }

    list = async () : Promise<T[]> => {
        return this.withOpenConnection((db1:any) => db1.getAll(this.storeName))
    }

    listFromIndex = async (indexName: string, query: any) : Promise<T[]> => {
        return this.withOpenConnection((db1: any) => db1.getAllFromIndex(this.storeName, indexName, query))
    }

    openCursor = async (indexName: string, query?: any, direction?: "next" | "nextunique" | "prev" | "prevunique" | undefined) => {
        const db1 = await this.open();
        const index = db1.transaction(this.storeName).store.index(indexName)
        return await index.openCursor(query, direction)
    }

    get = async (id: string) : Promise<T> => {
        return this.withOpenConnection((db1: any) => db1.get(this.storeName, id))
    }

    add = async (item: T) => {
        item.id = uuidv4()
        this.withOpenConnection((db1: any) => db1.add(this.storeName, item, item.id))
        this.emit(`item:added`)
    }

    addAll = async (items: T[]) => {
        this.withOpenConnection((db1: any) => {
            for (const item of items) {
                db1.add(this.storeName, item, item.id)    
            }
        })
    }

    upsert = async (item: T) => {
        this.withOpenConnection(async (db1: any) => {
            if (item.id) {
                await this.update(item)
            } else {
                await this.add(item)
            }
        })
    }

    update = async (item: T) => {
        this.withOpenConnection((db1: any) => db1.put(this.storeName, item, item.id))
        this.emit(`item:updated`)
    }

    delete = async (item: T) => {
        if (item.id) {
            await this.withOpenConnection((db1: any) => db1.delete(this.storeName, item.id))
            this.emit(`item:deleted`)
        }
    }
}