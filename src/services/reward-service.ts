import Reward from '../model/Reward';
import StoreService from './store-service';

const STORE_REWARDS = 'rewards'
let service: StoreService<Reward>

export default () => {
    if (!service) { 
        service = new StoreService<Reward>(STORE_REWARDS)  
    }
    return service
}

export {
    STORE_REWARDS
}