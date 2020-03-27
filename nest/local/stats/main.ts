import {createMicroservice} from '../../lib/functions/create-microservice'
import {StatsModule}        from "./stats.module";
import { WorldConstants }   from '../../lib/constants/world.constants'

createMicroservice(StatsModule, 'stats', 'Stats', 'local', WorldConstants.DB_NAME + '_stats').then().catch(e => console.error(e))
