import {NestFactory}    from '@nestjs/core';
import {ItemModule}     from './item.module';
import {environment}    from "../../lib/config/environment";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../../lib/constants/world.constants";


const logger = new Logger(WorldConstants.NAME + ' Item');

async function bootstrap() {
    const app = await NestFactory.createMicroservice(ItemModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.global,
            name : WorldConstants.NAME + ' Item',
            queue: WorldConstants.CONSTANT + '-item'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Item Microservice is listening ...");
    });
}

bootstrap();
