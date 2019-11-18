import {NestFactory}    from '@nestjs/core';
import {LobbyModule}    from './lobby.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../../lib/constants/ports";
import {createDatabase} from "../lib/database/database.module";
import {config}         from "../lib/config";

async function bootstrap() {
    await createDatabase('lobby');
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
