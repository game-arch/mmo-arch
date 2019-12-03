import {NestFactory}    from '@nestjs/core';
import {PresenceModule} from './presence.module';
import {createDatabase} from "../../lib/config/db.config";
import {Logger}         from "@nestjs/common";
import {environment}    from "../../lib/config/environment";

const logger = new Logger('Presence');

async function bootstrap() {
    await createDatabase('presence');
    const app = await NestFactory.createMicroservice(PresenceModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.options,
            name : 'Presence',
            queue: 'presence'
        }
    });
    app.useLogger(logger);
    app.enableShutdownHooks();
    await app.listen(() => {
        logger.log("Presence Microservice is listening ...");
    });
}

bootstrap();
