import {NestFactory}    from '@nestjs/core';
import {QuestModule}    from './quest.module';
import {createDatabase} from "../../lib/config/db.config";
import {environment}    from "../../lib/config/environment";
import {Logger}         from "@nestjs/common";
import * as path        from "path";

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const logger = new Logger('Quest');

async function bootstrap() {
    await createDatabase('quest');
    const app = await NestFactory.createMicroservice(QuestModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : 'Quest',
            queue: 'quest'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Quest Microservice is listening ...");
    });
}

bootstrap();
