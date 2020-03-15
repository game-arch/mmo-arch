import { NestFactory } from '@nestjs/core'
import { LobbyModule } from './lobby.module'
import { PORTS }       from '../../lib/constants/ports.constants'
import { environment } from '../../lib/config/environment'

async function bootstrap() {
    const app = await NestFactory.create(LobbyModule)
    app.connectMicroservice({
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.global,
            name: 'Lobby Server'
        }
    })
    app.enableCors({
        origin     : true,
        credentials: true
    })
    await app.startAllMicroservices()
    await app.listen(PORTS.LOBBY)
}

bootstrap().catch(e => console.error(e))
