import {NestFactory}    from '@nestjs/core';
import {ShardModule}    from './shard.module';
import {createDatabase} from "../lib/database/database.module";
import {PORTS}          from "../../../game-clients/lib/constants/ports";

async function bootstrap() {
    await createDatabase('shard');
    const app = await NestFactory.create(ShardModule);
    app.enableCors({
        origin     : true,
        credentials: true
    });

    await app.listen(PORTS.SHARD);
}

bootstrap();
