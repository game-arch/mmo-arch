import {ClientProxy}                           from "@nestjs/microservices";
import {Injectable}                            from "@nestjs/common";
import {CharacterLoggedIn, CharacterLoggedOut} from "./actions";

@Injectable()
export class CharacterEmitter {

    constructor(private client: ClientProxy) {

    }

    characterLoggedIn(id: number, gender: 'male' | 'female', world:string, name: string) {
        this.client.emit(CharacterLoggedIn.event, new CharacterLoggedIn(id, name, world, gender));
    }

    characterLoggedOut(id: number, name: string, world:string) {
        this.client.emit(CharacterLoggedOut.event, new CharacterLoggedOut(id, name, world));
    }
}