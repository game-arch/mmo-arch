import { CharacterModule }    from './character.module'
import { createMicroservice } from '../../../lib/functions/create-microservice'

createMicroservice(CharacterModule, 'character', 'Character', 'local').then()
