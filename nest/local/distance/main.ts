import '@geckos.io/phaser-on-nodejs'
import 'phaser/src/phaser-arcade-physics'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { DistanceModule }     from './distance.module'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(DistanceModule, 'distance', 'Distance', 'local', WorldConstants.DB_NAME + '_distance').then().catch(e => console.error(e))
