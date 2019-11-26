import {NestFactory}    from '@nestjs/core';
import {WorldModule}    from './world.module';
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";
import {WorldConstants} from "../constants";

const logger = new Logger(WorldConstants.NAME + ' Server');
async function bootstrap() {
    const app = await NestFactory.create(WorldModule);
    app.connectMicroservice({
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            name: WorldConstants.NAME + ' Server'
        }
    });
    app.enableCors({
        origin     : true,
        credentials: true
    });
    app.useLogger(logger);
    await app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.listen(config.servers.world.port);
}

bootstrap();
