import {NestFactory}    from '@nestjs/core';
import {PresenceModule} from './presence.module';
import {PORTS}          from "../../../lib/constants/ports";
import {createDatabase} from "../../lib/database.module";
import {Logger}         from "@nestjs/common";

const logger = new Logger('Presence');
async function bootstrap() {
    await createDatabase('presence');
    const app = await NestFactory.create(PresenceModule);
    app.useLogger(logger);
    app.enableShutdownHooks();
    await app.listen(PORTS.PRESENCE);
}

bootstrap();
