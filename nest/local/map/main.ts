import '@geckos.io/phaser-on-nodejs'
import 'phaser/src/phaser-arcade-physics'
import { MapModule }          from './map.module'
import { createMicroservice } from '../../lib/functions/create-microservice'
import {MapConstants}         from "./constants";

createMicroservice(MapModule, 'map.' + MapConstants.MAP, 'Map', 'local').then().catch(e => console.error(e))
