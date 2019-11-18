import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {RedisIoAdapter} from "../lib/redis-io.adapter";
import {createDatabase} from "../lib/database/database.module";
import {Logger}         from "@nestjs/common";
import {config}         from "../lib/config";

const logger = new Logger('Account');

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.createMicroservice(AccountModule, config.microservice);
    app.useLogger(logger);
    app.useWebSocketAdapter(new RedisIoAdapter(app));
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
