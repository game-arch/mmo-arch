import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {PORTS}          from "../constants";
import {createDatabase} from "../lib/database/database.module";

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.create(AccountModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.enableCors({
        origin     : true,
        credentials: true
    });
    console.log(PORTS.ACCOUNT);
    await app.listen(PORTS.ACCOUNT);

}

bootstrap();
