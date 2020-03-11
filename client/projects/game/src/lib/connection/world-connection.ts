import { Connection }                     from './connection'
import { GameWorld }                      from '../../../../../../server/lib/interfaces/game-world'
import { CharacterOnline, GetCharacters } from '../../../../../../server/services/local/character/actions'
import { GameCharacter }                  from '../../../../../../server/lib/interfaces/game-character'

export class WorldConnection extends Connection {
    characters: GameCharacter[] = []

    selectedCharacter: { id: number; name: string } = null

    constructor(
        public world?: GameWorld,
        public location?: string,
        public token?: string,
    ) {
        super(world, location ? location + '/world' : null, token)
        if (this.socket) {
            this.socket.on(
                GetCharacters.event,
                list => (this.characters = list),
            )
            this.socket.on('disconnect', typeOfDisconnect => {
                if (typeOfDisconnect === 'io client disconnect') {
                    this.selectedCharacter = null
                    return
                }
                if (this.selectedCharacter !== null) {
                    console.info(
                        'Disconnected from world... trying to reconnect...',
                    )
                }
            })
            this.socket.on('connect', () => {
                if (this.selectedCharacter !== null) {
                    console.info(
                        'Connecting as ' + this.selectedCharacter + '...',
                    )
                    this.socket.once(GetCharacters.event, async () => {
                        await this.selectCharacter(
                            this.selectedCharacter.name,
                            this.selectedCharacter.id,
                        )
                    })
                }
            })
        }
    }

    selectCharacter(characterName: string, characterId: number) {
        return new Promise((resolve, reject) => {
            this.socket.emit(
                CharacterOnline.event,
                { id: characterId, name: characterName },
                data => {
                    if (data.status === 'success') {
                        this.selectedCharacter = {
                            id  : characterId,
                            name: characterName,
                        }
                        console.log('You are logged in as ' + characterName)
                        resolve(data)
                    } else {
                        console.log('Could not sign in as ' + characterName)
                        reject('Character already signed in.')
                    }
                },
            )
        })
    }
}
