import {NestFactory}    from '@nestjs/core';
import {QuestModule}    from './quest.module';
import {createDatabase} from "../../lib/database/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Quest');

async function bootstrap() {
    await createDatabase('quest');
    const app = await NestFactory.createMicroservice(QuestModule, config.microservice);
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Map Microservice is listening ...");
    });
}

bootstrap();
