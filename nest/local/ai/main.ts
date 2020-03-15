
import { createMicroservice } from '../../lib/functions/create-microservice'
import { AiModule }           from './ai.module'

createMicroservice(AiModule, 'ai', 'AI', 'local').then().catch(e => console.error(e))
