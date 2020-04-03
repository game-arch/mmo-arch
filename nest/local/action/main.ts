import { createMicroservice } from '../../lib/functions/create-microservice'
import { WorldConstants }     from '../../lib/constants/world.constants'
import { ActionModule }       from './action.module'

createMicroservice(ActionModule, 'action', 'Action', 'local', WorldConstants.DB_NAME + '_action').then().catch(e => console.error(e))
