import { PartyModule }        from './party.module'
import { createMicroservice } from '../../lib/functions/create-microservice'
import { WorldConstants }     from '../../lib/constants/world.constants'

createMicroservice(PartyModule, 'party', 'Party', 'local', WorldConstants.DB_NAME + '_party').then().catch(e => console.error(e))
