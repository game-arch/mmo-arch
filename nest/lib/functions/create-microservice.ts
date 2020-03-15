import { Logger, Type } from '@nestjs/common'
import { NestFactory }  from '@nestjs/core'
import { environment }  from '../config/environment'

export async function createMicroservice(module: Type<any>, key: string, label: string, queueType: 'local' | 'global') {
    const logger = new Logger(label)
    const app    = await NestFactory.createMicroservice(module, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice[queueType],
            name : label,
            queue: key,
        },
    })

    app.useLogger(logger)
    await app.listen(() => {
        logger.log(label + ' Microservice is listening ...')
    })
}
