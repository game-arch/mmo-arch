import {NestFactory}    from '@nestjs/core';
import {ShardModule}    from './shard.module';
import {PORTS}          from "../constants";
import {createDatabase} from "../lib/database/database.module";

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
