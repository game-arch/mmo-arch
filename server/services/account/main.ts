import { NestFactory }   from "@nestjs/core";
import { AccountModule } from "./account.module";
import { Logger }        from "@nestjs/common";
import { environment }   from "../../lib/config/environment";

const logger = new Logger("Account");

async function bootstrap() {
    const app = await NestFactory.createMicroservice(AccountModule, {
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice.global,
            name: "Account"
        }
    });
    app.useLogger(logger);
    await app.listen(() => {
        logger.log("Account Microservice is listening ...");
    });

}

bootstrap();
