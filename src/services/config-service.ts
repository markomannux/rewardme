import Config from '../model/Config';
import StoreService from './store-service';

const STORE_CONFIG = 'config'
let service: StoreService<Config>

export default () => {
    if (!service) { 
        service = new StoreService<Config>(STORE_CONFIG)  
    }
    return service
}

export {
    STORE_CONFIG
}