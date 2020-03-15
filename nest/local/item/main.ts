import { createMicroservice } from '../../lib/functions/create-microservice'
import { ItemModule }         from './item.module'

createMicroservice(ItemModule, 'item', 'Item', 'local').then().catch(e => console.error(e))
