import {NestFactory}    from '@nestjs/core';
import {ItemModule}     from './item.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Item');

async function bootstrap() {
    await createDatabase('item');
    const app = await NestFactory.createMicroservice(ItemModule, {
        transport: config.microservice.transport,
        options: {
            url: config.microservice.options.url,
            queue: 'item'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Item Microservice is listening ...");
    });
}

bootstrap();
