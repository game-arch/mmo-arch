import { createMicroservice } from '../../lib/functions/create-microservice'
import { ItemModule }         from './item.module'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(ItemModule, 'item', 'Item', 'local', WorldConstants.DB_NAME + '_item').then().catch(e => console.error(e))
