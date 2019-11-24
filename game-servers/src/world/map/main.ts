import {NestFactory}    from '@nestjs/core';
import {MapModule}      from './map.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";


const logger = new Logger(WorldConstants.NAME + ' Map');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_PREFIX + '_map');
    const app = await NestFactory.createMicroservice(MapModule, {
        transport: config.microservice.transport,
        options  : {
            ...config.microservice.options,
            queue: WorldConstants.CONSTANT + '.map'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Map Microservice is listening ...");
    });
}

bootstrap();
