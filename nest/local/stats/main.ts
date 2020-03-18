import {createMicroservice} from '../../lib/functions/create-microservice'
import {StatsModule}        from "./stats.module";

createMicroservice(StatsModule, 'stats', 'Stats', 'local').then().catch(e => console.error(e))
