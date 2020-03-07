import { ClientProxyFactory } from "@nestjs/microservices";
import { environment }        from "../config/environment";

export function createMicroserviceClient(key: string, label: string, queueType: "global" | "local") {
    return ClientProxyFactory.create(<any>{
        transport: environment.microservice.transport,
        options  : {
            ...environment.microservice[queueType],
            name : label + " Client",
            queue: key
        }
    });
}
