import {NestFactory}    from '@nestjs/core';
import {QuestModule}    from './quest.module';
import {environment}    from "../../lib/config/environment";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../../lib/constants/world.constants";

const logger = new Logger(WorldConstants.NAME + ' Quest');

async function bootstrap() {
    const app = await NestFactory.createMicroservice(QuestModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : WorldConstants.NAME + ' Quest',
            queue: WorldConstants.CONSTANT + '-quest'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Item Microservice is listening ...");
    });
}

bootstrap();
