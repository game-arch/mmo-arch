import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {createDatabase} from "../../lib/database.module";
import {Logger}         from "@nestjs/common";
import {config}         from "../../lib/config";

const logger = new Logger('Account');

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.createMicroservice(AccountModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: 'account'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
