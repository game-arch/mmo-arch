import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {createDatabase} from "../lib/database/database.module";
import {PORTS}          from "../../../game-clients/lib/constants/ports";

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.create(AccountModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    app.enableCors({
        origin     : true,
        credentials: true
    });
    await app.listen(PORTS.ACCOUNT);

}

bootstrap();
