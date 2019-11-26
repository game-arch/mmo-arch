import {Connection}                       from "./connection";
import Socket = SocketIOClient.Socket;
import {GameWorld}                        from "../../../../../game-servers/lib/entities/game-world";
import {CharacterGetAll, CharacterOnline} from "../../../../../game-servers/src/global/character/actions";
import {GameCharacter}                    from "../../../../../game-servers/lib/entities/game-character";

export class WorldConnection extends Connection {

    characters: GameCharacter[] = [];

    selectedCharacter: { id: number, name: string } = null;

    constructor(public world?: GameWorld, public socket?: Socket) {
        super(world, socket);
        if (this.socket) {
            this.socket.on(CharacterGetAll.event, list => this.characters = list);
            this.socket.on('disconnect', (typeOfDisconnect) => {
                if (typeOfDisconnect === 'io client disconnect') {
                    this.selectedCharacter = null;
                    return;
                }
                if (this.selectedCharacter !== null) {
                    console.info('Disconnected from world... trying to reconnect...');
                }
            });
            this.socket.on('connect', () => {
                if (this.selectedCharacter !== null) {
                    console.info('Connecting as ' + this.selectedCharacter + '...');
                    this.socket.once(CharacterGetAll.event, async () => {
                        await this.selectCharacter(this.selectedCharacter.name, this.selectedCharacter.id);
                    });
                }
            });
        }
    }

    selectCharacter(characterName: string, characterId: number) {
        return new Promise((resolve, reject) => {
            this.socket.emit(CharacterOnline.event, {id: characterId, name: characterName}, (data) => {
                if (data.status === 'success') {
                    this.selectedCharacter = {id: characterId, name: characterName};
                    console.log('You are logged in as ' + characterName);
                    resolve(data);
                } else {
                    console.log("Could not sign in as " + characterName);
                    reject();
                }
            });
        });
    }
}
