import { PartyModule }        from './party.module'
import { createMicroservice } from '../../lib/functions/create-microservice'

createMicroservice(PartyModule, 'party', 'Party', 'local').then().catch(e => console.error(e))
