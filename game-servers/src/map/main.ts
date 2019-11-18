import {NestFactory}    from '@nestjs/core';
import {MapModule}      from './map.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../../../game-clients/lib/constants/ports";
import {createDatabase} from "../lib/database/database.module";

async function bootstrap() {
    await createDatabase('map');
    const app = await NestFactory.create(MapModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.listen(PORTS.MAP);
}

bootstrap();
