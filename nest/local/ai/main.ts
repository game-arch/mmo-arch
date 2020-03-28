import '@geckos.io/phaser-on-nodejs'
import 'phaser/src/phaser-arcade-physics'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { AiModule }           from './ai.module'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(AiModule, 'ai', 'AI', 'local', WorldConstants.DB_NAME + '_ai').then().catch(e => console.error(e))
