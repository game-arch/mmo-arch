import {NestFactory}    from '@nestjs/core';
import {StatsModule}    from './stats.module';
import {createDatabase} from "../../lib/database/database.module";
import {config}         from "../../lib/config";
import {Logger}         from "@nestjs/common";


const logger = new Logger('Stats');

async function bootstrap() {
    await createDatabase('stats');
    const app = await NestFactory.createMicroservice(StatsModule, {
        transport: config.microservice.transport,
        options  : {
            url  : config.microservice.options.url,
            queue: 'stats'
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Stats Microservice is listening ...");
    });
}

bootstrap();
