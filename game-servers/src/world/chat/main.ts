import {NestFactory}    from '@nestjs/core';
import {ChatModule}     from './chat.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME + ' Chat');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_NAME);
    const app = await NestFactory.createMicroservice(ChatModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.chat'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Chat Microservice is listening ...");
    });
}

bootstrap();
