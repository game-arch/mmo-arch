import {NestFactory}    from '@nestjs/core';
import {MapModule}      from './map.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../constants";

async function bootstrap() {
    const app = await NestFactory.create(MapModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.listen(PORTS.MAP);
}

bootstrap();
