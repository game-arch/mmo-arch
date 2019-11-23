import {Injectable}      from "@nestjs/common";
import {ClientProxy}     from "@nestjs/microservices";
import {first}           from "rxjs/operators";
import {CharacterEvents} from "../character.events";
import {Character}       from "../entities/character";

@Injectable()
export class CharacterClient {

    constructor(private client: ClientProxy) {

    }

    async create(accountId: number, name: string, gender: 'male' | 'female'): Promise<Character> {
        return await this.client.send(CharacterEvents.CREATE, {accountId, name, gender}).pipe(first()).toPromise();
    }

    async getAll(accountId: number) {
        return await this.client.send(CharacterEvents.GET_ALL, {accountId}).pipe(first()).toPromise();
    }
}
