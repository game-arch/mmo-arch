import { Logger, Type }   from '@nestjs/common'
import { NestFactory }    from '@nestjs/core'
import { environment }    from '../config/environment'
import { createDatabase } from '../config/db.config'

require('events').EventEmitter.defaultMaxListeners = 1000

export const LOGGER = {
    logger: null
}

export async function createMicroservice(module: Type<any>, key: string, label: string, queueType: 'local' | 'global', dbName?: string) {

    const logger  = new Logger(label)
    LOGGER.logger = logger
    if (dbName) {
        await createDatabase(dbName, true)
    }
    const app = await NestFactory.createMicroservice(module, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice[queueType],
            name : label,
            queue: key
        }
    })

    app.useLogger(logger)
    await app.listen(() => {
        logger.log('Listening ...')
    })
}
