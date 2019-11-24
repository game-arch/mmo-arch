import {NestFactory}    from '@nestjs/core';
import {AiModule}       from './ai.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME + ' AI');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_PREFIX + '_ai');
    const app = await NestFactory.createMicroservice(AiModule, {
        transport: config.microservice.transport,
        options  : {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.area'

        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " AI Microservice is listening ...");
    });
}

bootstrap();
