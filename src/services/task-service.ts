import Task from '../model/Task';
import StoreService from './store-service';

const STORE_TASKS = 'tasks'
let service: StoreService<Task>

export default () => {
    if (!service) { 
        service = new StoreService<Task>(STORE_TASKS)  
    }
    return service
}

export {
    STORE_TASKS
}