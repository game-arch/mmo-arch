import {NestFactory}    from '@nestjs/core';
import {AccountModule}  from './account.module';
import {createDatabase} from "../../lib/database.module";
import {Logger}         from "@nestjs/common";
import {options}        from "./microservice.options";

const logger = new Logger('Account');

async function bootstrap() {
    await createDatabase('account');
    const app = await NestFactory.createMicroservice(AccountModule, options);
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
