import {NestFactory} from '@nestjs/core';
import {LobbyModule} from './lobby.module';
import {PORTS}       from "../../../lib/constants/ports";
import {config}      from "../../lib/config";

async function bootstrap() {
    const app = await NestFactory.create(LobbyModule);
    app.connectMicroservice(config.microservice);
    app.enableCors({
        origin     : true,
        credentials: true
    });
    await app.startAllMicroservices();
    await app.listen(PORTS.LOBBY);
}

bootstrap();
