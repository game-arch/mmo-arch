import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {createDatabase} from "../../config/db.config";
import {Logger}         from "@nestjs/common";
import {environment}    from "../../config/environment";

const logger = new Logger('Account');

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.createMicroservice(AccountModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : 'Account',
            queue: 'account'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
