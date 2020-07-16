import { createMicroservice } from '../../lib/functions/create-microservice'
import { WorldConstants }     from '../../lib/constants/world.constants'
import { CommandModule }      from './command.module'

createMicroservice(CommandModule, 'command', 'Command', 'local', WorldConstants.DB_NAME + '_command').then().catch(e => console.error(e))
