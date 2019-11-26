import {NestFactory}    from '@nestjs/core';
import {PresenceModule} from './presence.module';
import {createDatabase} from "../../lib/database.module";
import {Logger}         from "@nestjs/common";
import {config}         from "../../lib/config";

const logger = new Logger('Presence');

async function bootstrap() {
    await createDatabase('presence');
    const app = await NestFactory.createMicroservice(PresenceModule, {
        transport: config.microservice.transport,
        options  : {
            ...config.microservice.options,
            name: 'Presence',
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
