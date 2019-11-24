import {NestFactory}    from '@nestjs/core';
import {QuestModule}    from './quest.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME  + ' Quest');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_NAME);
    const app = await NestFactory.createMicroservice(QuestModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.quest'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Quest Microservice is listening ...");
    });
}

bootstrap();
