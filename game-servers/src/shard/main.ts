import {NestFactory}    from '@nestjs/core';
import {ShardModule}    from './shard.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../constants";

async function bootstrap() {
    console.log(process.env.NODE_APP_INSTANCE);
    const app = await NestFactory.create(ShardModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.enableCors({
        origin     : true,
        credentials: true
    });

    await app.listen(parseInt(process.env.PORT || ('' + PORTS.SHARD)) + parseInt(process.env.NODE_APP_INSTANCE));
}

bootstrap();
