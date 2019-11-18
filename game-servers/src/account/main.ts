import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {createDatabase} from "../lib/database/database.module";
import {Logger}         from "@nestjs/common";
import {config}         from "../lib/config";

const logger = new Logger('Account');

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.createMicroservice(AccountModule, config.microservice);
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
