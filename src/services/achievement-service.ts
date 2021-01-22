import Achievement from '../model/Achievement'
import StoreService from './store-service';

const STORE_ACHIEVEMENTS = 'achievements'
let service: StoreService<Achievement>


export default () => {
    if (!service) {
        service = new StoreService<Achievement>(STORE_ACHIEVEMENTS)
    }
    return service
}

export {
    STORE_ACHIEVEMENTS
}