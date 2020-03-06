import { Module }             from "@nestjs/common";
import { CharacterClient }    from "./character.client";
import { ClientProxyFactory } from "@nestjs/microservices";
import { environment }        from "../../../lib/config/environment";
import { WorldConstants }     from "../../../lib/constants/world.constants";

export const clientFactory   = () => ClientProxyFactory.create(<any>{
  transport: environment.microservice.transport,
  options  : {
    ...environment.microservice.global,
    name : WorldConstants.NAME + " Map Client",
    queue: WorldConstants.CONSTANT + "-map"
  }
});
export const CLIENT_PROVIDER = {
  provide   : "CHARACTER_CLIENT",
  useFactory: clientFactory
};

@Module({
  imports  : [],
  providers: [
    CLIENT_PROVIDER,
    CharacterClient
  ],
  exports  : [
    CharacterClient
  ]
})
export class CharacterClientModule {

}
