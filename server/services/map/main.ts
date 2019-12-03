import "@geckos.io/phaser-on-nodejs";
import "phaser";
import {NestFactory}    from '@nestjs/core';
import {MapModule}      from './map.module';
import {createDatabase} from "../../lib/config/db.config";
import {environment}    from "../../lib/config/environment";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../../lib/constants/world.constants";
import * as path        from "path";

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const logger = new Logger(WorldConstants.NAME + ' Map');

async function bootstrap() {
    await createDatabase(WorldConstants.DB_NAME);
    const app = await NestFactory.createMicroservice(MapModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : WorldConstants.NAME + ' Map',
            queue: WorldConstants.CONSTANT + '.map'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log(WorldConstants.NAME + " Map Microservice is listening ...");
    });
}

bootstrap();
