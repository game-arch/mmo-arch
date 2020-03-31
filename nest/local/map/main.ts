import '@geckos.io/phaser-on-nodejs'
import 'phaser/src/phaser-arcade-physics'
import { MapModule }          from './map.module'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { MapConstants }       from './constants'
import { WorldConstants }     from '../../lib/constants/world.constants'


createMicroservice(MapModule, 'map.' + MapConstants.MAP + '.' + MapConstants.INSTANCE_ID, process.env.MAP_NAME + ' (' + MapConstants.INSTANCE_ID + ')', 'local', WorldConstants.DB_NAME + '_map').then().catch(e => console.error(e))
