import {NestFactory}    from '@nestjs/core';
import {ItemModule}     from './item.module';
import {createDatabase} from "../../config/db.config";
import {environment}    from "../../config/environment";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Item');

async function bootstrap() {
    await createDatabase('item');
    const app = await NestFactory.createMicroservice(ItemModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : 'Item',
            queue: 'item'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Item Microservice is listening ...");
    });
}

bootstrap();
