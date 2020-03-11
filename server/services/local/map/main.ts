import '@geckos.io/phaser-on-nodejs'
import 'phaser'
import { MapModule }          from './map.module'
import { createMicroservice } from '../../../lib/functions/create-microservice'

createMicroservice(MapModule, 'map', 'Map', 'local').then()
