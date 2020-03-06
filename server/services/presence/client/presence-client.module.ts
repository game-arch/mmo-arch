import { Module }             from "@nestjs/common";
import { PresenceClient }     from "./presence.client";
import { ClientProxyFactory } from "@nestjs/microservices";
import { environment }        from "../../../lib/config/environment";

export const clientFactory   = () => ClientProxyFactory.create(<any>{
  transport: environment.microservice.transport,
  options  : {
    ...environment.microservice.global,
    name : "Presence Client",
    queue: "presence"
  }
});
export const CLIENT_PROVIDER = {
  provide   : "PRESENCE_CLIENT",
  useFactory: clientFactory
};

@Module({
  providers: [
    CLIENT_PROVIDER,
    PresenceClient
  ],
  exports  : [
    PresenceClient
  ]
})
export class PresenceClientModule {

}
