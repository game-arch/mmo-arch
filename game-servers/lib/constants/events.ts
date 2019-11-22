import {CharacterEvents} from "../../src/microservice/character/character.events";

export class Events {
    static readonly SERVER_LIST           = 'presence.servers';
    static readonly CHARACTER_LIST        = CharacterEvents.GET_ALL;
    static readonly CREATE_CHARACTER      = CharacterEvents.CREATE;
    static readonly CHARACTER_JOINED      = 'character.joined';
    static readonly CHARACTER_LEFT        = 'character.left';
    static readonly CHARACTER_CREATED     = 'character.created';
    static readonly CHARACTER_NOT_CREATED = 'character.not_created';
    static readonly USER_CONNECTED        = 'presence.user_connected';
    static readonly USER_DISCONNECTED     = 'presence.user_disconnected';

}
