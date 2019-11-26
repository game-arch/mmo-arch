import {Connection}      from "./connection";
import Socket = SocketIOClient.Socket;
import {GameWorld}       from "../../../../../game-servers/lib/entities/game-world";
import {Events}          from "../../../../../game-servers/lib/constants/events";
import {CharacterOnline} from "../../../../../game-servers/lib/actions";
import {GameCharacter}   from "../../../../../game-servers/lib/entities/game-character";

export class WorldConnection extends Connection {

    characters: GameCharacter[] = [];

    selectedCharacter = '';

    constructor(public world?: GameWorld, public socket?: Socket) {
        super(world, socket);
        if (this.socket) {
            this.socket.on(Events.CHARACTER_LIST, list => this.characters = list);
            this.socket.on('disconnect', (typeOfDisconnect) => {
                if (typeOfDisconnect === 'io client disconnect') {
                    this.selectedCharacter = '';
                    return;
                }
                if (this.selectedCharacter !== '') {
                    console.info('Disconnected from world... trying to reconnect...');
                }
            });
            this.socket.on('connect', () => {
                if (this.selectedCharacter !== '') {
                    console.info('Connecting as ' + this.selectedCharacter + '...');
                    this.socket.once(Events.CHARACTER_LIST, () => {
                        this.selectCharacter(this.selectedCharacter);
                    });
                }
            });
        }
    }

    selectCharacter(character: string) {
        return new Promise((resolve, reject) => {
            this.socket.emit(CharacterOnline.event, {name: character}, (data) => {
                if (data.status === 'success') {
                    this.selectedCharacter = character;
                    console.log('You are logged in as ' + this.selectedCharacter);
                    resolve(data);
                } else {
                    console.log("Could not sign in as " + character);
                    reject();
                }
            });
        });
    }
}
