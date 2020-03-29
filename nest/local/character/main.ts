import { CharacterModule }    from './character.module'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(CharacterModule, 'character', 'Character', 'local', WorldConstants.DB_NAME + '_character').then().catch(e => console.error(e))
