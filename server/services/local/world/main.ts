import { NestFactory }    from '@nestjs/core'
import { WorldModule }    from './world.module'
import { environment }    from '../../../lib/config/environment'
import { Logger }         from '@nestjs/common'
import { WorldConstants } from '../../../lib/constants/world.constants'

const logger = new Logger(WorldConstants.NAME + ' Server')

async function bootstrap() {
    const app = await NestFactory.create(WorldModule)
    app.connectMicroservice({
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.global,
            name : WorldConstants.NAME + ' Server',
            queue: WorldConstants.CONSTANT + '.' + process.env.NODE_APP_INSTANCE,
        },
    })
    app.enableCors({
        origin     : true,
        credentials: true,
    })
    app.useLogger(logger)
    await app.enableShutdownHooks()
    await app.startAllMicroservices()
    await app.listen(environment.servers.world.port)
}

bootstrap()
