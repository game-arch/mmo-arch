import { AccountModule }      from './account.module'
import { createMicroservice } from '../../../lib/functions/create-microservice'

createMicroservice(AccountModule, 'account', 'Account', 'global').then()
