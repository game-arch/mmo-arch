import {NestFactory}    from '@nestjs/core';
import {PresenceModule} from './presence.module';
import {PORTS}          from "../../lib/constants/ports";
import {createDatabase} from "../lib/database/database.module";

async function bootstrap() {
    await createDatabase('presence');
    const app = await NestFactory.create(PresenceModule);
    app.enableShutdownHooks();
    await app.listen(PORTS.PRESENCE);
}

bootstrap();
