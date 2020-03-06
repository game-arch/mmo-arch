import { Inject, Injectable }                                       from "@nestjs/common";
import { ClientProxy }                                              from "@nestjs/microservices";
import { GetAllPlayers, GetPlayerPosition, PlayerDirectionalInput } from "../actions";
import { first }                                                    from "rxjs/operators";
import { WORLD_PREFIX }                                             from "../../world/world.prefix";
import { CharacterEmitter }                                         from "../../character/character.emitter";

@Injectable()
export class MapClient extends CharacterEmitter {
  constructor(@Inject("MAP_CLIENT") protected client: ClientProxy) {
    super(client);
  }

  async getAllPlayers(map: string) {
    return await this.client
                     .send(WORLD_PREFIX + GetAllPlayers.event, new GetAllPlayers(map))
                     .pipe(first())
                     .toPromise();
  }

  async getPlayer(
    characterId: number,
    map: string
  ): Promise<{ x: number; y: number }> {
    return await this.client
                     .send(
                       WORLD_PREFIX + GetPlayerPosition.event + "." + map,
                       new GetPlayerPosition(characterId)
                     )
                     .pipe(first())
                     .toPromise();
  }

  playerDirectionalInput(
    characterId: number,
    world: string,
    map: string,
    directions: { up: boolean; down: boolean; left: boolean; right: boolean }
  ) {
    this.client.emit(
      WORLD_PREFIX + PlayerDirectionalInput.event,
      new PlayerDirectionalInput(characterId, map, directions)
    );
  }
}
