import {NestFactory}    from '@nestjs/core';
import {LobbyModule}    from './lobby.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../../lib/constants/ports";
import {createDatabase} from "../lib/database/database.module";

async function bootstrap() {
    await createDatabase('lobby');
    const app = await NestFactory.create(LobbyModule);
    app.enableCors({
        origin     : true,
        credentials: true
    });

    await app.listen(PORTS.LOBBY);
}

bootstrap();
