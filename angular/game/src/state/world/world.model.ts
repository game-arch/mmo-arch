import Socket = SocketIOClient.Socket
import { GameCharacter } from '../../../../../shared/interfaces/game-character'

export class WorldModel {
    characters: GameCharacter[]                                                  = null
    character: number
    socket: Socket
    name: string
    channels: { channel: number, playerCount: number, playerCapacity: number }[] = []
}
