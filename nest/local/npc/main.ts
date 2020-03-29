import '@geckos.io/phaser-on-nodejs'
import 'phaser/src/phaser-arcade-physics'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { NpcModule }          from './npc.module'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(NpcModule, 'npc', 'NPC', 'local', WorldConstants.DB_NAME + '_npc').then().catch(e => console.error(e))
