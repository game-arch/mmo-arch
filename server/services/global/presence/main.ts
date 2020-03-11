import { PresenceModule }     from './presence.module'
import { createMicroservice } from '../../../lib/functions/create-microservice'

createMicroservice(PresenceModule, 'presence', 'Presence', 'global').then()
