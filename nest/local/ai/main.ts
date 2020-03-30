import { createMicroservice } from '../../lib/functions/create-microservice'
import { WorldConstants }     from '../../lib/constants/world.constants'
import { AiModule }           from './ai.module'

createMicroservice(AiModule, 'ai', 'AI', 'local', WorldConstants.DB_NAME + '_ai').then().catch(e => console.error(e))
