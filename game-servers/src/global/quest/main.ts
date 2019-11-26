import {NestFactory}    from '@nestjs/core';
import {QuestModule}    from './quest.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Quest');

async function bootstrap() {
    await createDatabase('quest');
    const app = await NestFactory.createMicroservice(QuestModule, {
        transport: config.microservice.transport,
        options  : {
            ...config.microservice.options,
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
