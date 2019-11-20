import {NestFactory}    from '@nestjs/core';
import {ItemModule}     from './item.module';
import {createDatabase} from "../../lib/database/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Map');

async function bootstrap() {
    await createDatabase('item');
    const app = await NestFactory.createMicroservice(ItemModule, config.microservice);
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Item Microservice is listening ...");
    });
}

bootstrap();
