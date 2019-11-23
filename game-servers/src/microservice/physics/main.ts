import {NestFactory}    from '@nestjs/core';
import {PhysicsModule}  from './physics.module';
import {createDatabase} from "../../lib/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Physics');

async function bootstrap() {
    const app = await NestFactory.createMicroservice(PhysicsModule, {
        transport: config.microservice.transport,
        options: {
            ...config.microservice.options,
            queue: 'physics'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Physics Microservice is listening ...");
    });
}

bootstrap();
