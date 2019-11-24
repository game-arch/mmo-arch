import {NestFactory}    from '@nestjs/core';
import {ItemModule}     from './item.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME + ' Item');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_PREFIX + '_item');
    const app = await NestFactory.createMicroservice(ItemModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.item'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Item Microservice is listening ...");
    });
}

bootstrap();
