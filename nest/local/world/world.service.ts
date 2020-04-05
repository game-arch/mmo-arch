import { Injectable }       from '@nestjs/common'
import { AccountClient }    from '../../global/account/client/account.client'
import { Socket }           from 'socket.io'
import { CharacterClient }  from '../character/client/character.client'
import { WorldConstants }   from '../../lib/constants/world.constants'
import { MapClient }        from '../map/client/map.client'
import { Repository }       from 'typeorm'
import { Player }           from './entities/player'
import { InjectRepository } from '@nestjs/typeorm'
import { GetMapChannels }   from '../../../shared/actions/map.actions'
import { CharacterOnline }  from '../../../shared/actions/character.actions'


@Injectable()
export class WorldService {
    shuttingDown = false

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private account: AccountClient,
        private character: CharacterClient,
        private map: MapClient
    ) {
    }


    async storeUser(client: Socket, accountId: number) {
        if (!this.shuttingDown) {
            const player     = this.players.create()
            player.accountId = accountId
            player.socketId  = client.id
            player.instance  = Number(process.env.NODE_APP_INSTANCE)
            await this.players.save(player)
        }
    }

    async removePlayer(client: Socket) {
        if (!this.shuttingDown) {
            try {
                await this.removeCharacter(client)
                await this.players.delete({ socketId: client.id })
            } catch (e) {
                // Bad timing shutting down
            }
        }
    }

    async storeCharacter(client: Socket, character: CharacterOnline) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && character.characterId) {
                await this.validateCharacterLogin(player, character.characterId)
                await this.character.characterOnline(character.characterId, client.id)
                player.characterId   = character.characterId
                player.characterName = await this.character.getCharacterName(character.characterId)
                await this.players.save(player)
                client.join('character-id.' + player.characterId)
                client.join('character-name.' + player.characterName)
            }
        }
    }

    async validateCharacterLogin(player: Player, characterId: number) {
        if (!this.shuttingDown) {
            const verified = await this.character.getCharacter(characterId)
            if (verified.accountId !== player.accountId) {
                throw new Error('Character\'s Account ID does not match')
            }
            if (verified.world !== WorldConstants.CONSTANT) {
                throw new Error('Character is on a different world')
            }
            // if (verified.status !== "offline") {
            //     throw new Error("Character is already online");
            // }
        }
    }

    async removeCharacter(client: Socket) {
        if (!this.shuttingDown) {
            try {
                const player = await this.players.findOne({ socketId: client.id })
                if (player) {
                    await this.character.characterOffline(player.characterId)
                    client.adapter.del(client.id, 'character-id.' + player.characterId)
                    client.adapter.del(client.id, 'character-name.' + player.characterName)
                    player.characterId   = null
                    player.characterName = null
                    await this.players.save(player)
                }
            } catch (e) {
                // Bad timing shutting down
            }
        }
    }

    async authenticate(socket: Socket) {
        if (!this.shuttingDown) {
            try {
                const account: { id: number, email: string } = await this.account.getAccount(socket.handshake.query.token, true)
                return account
            } catch (e) {
                throw new Error('Session Expired')
            }
        }
    }

    async getCharacters(accountId: number) {
        if (!this.shuttingDown) {
            return await this.character.getAll(accountId, WorldConstants.CONSTANT)
        }
        return []
    }

    async createCharacter(accountId: number, name: string, gender: 'male' | 'female') {
        if (!this.shuttingDown) {
            return await this.character.create(accountId, WorldConstants.CONSTANT, name, gender)
        }
        return null
    }

    async playerDirectionalInput(client: Socket, data: { directions: { up: boolean, down: boolean, left: boolean, right: boolean } }) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && player.characterId !== null) {
                const map = this.getMapOf(client)
                this.map.playerDirectionalInput(player.characterId, map, player.channel, data.directions)
            }
        }
    }

    async playerAttemptedTransition(client: Socket) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            let map      = this.getMapOf(client)
            if (player && player.characterId !== null && map) {
                return await this.map.playerAttemptedTransition(player.characterId, map, player.channel)
            }
        }
        return { status: false, map: null, reason: 'shutting_down_server' }
    }


    async changeInstance(client: Socket, channel: number) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && player.characterId !== null) {
                let position: any = await this.map.findPlayer(player.characterId)
                this.map.changeChannel(player.characterId, position.map, position.channel, channel)
            }
        }
    }

    async getChannels(client: Socket, data: GetMapChannels) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player) {
                let position: any = await this.map.findPlayer(data.characterId || player.characterId)
                return await this.map.getChannels(data.map || position.map)
            }
        }
        return []
    }


    getMapOf(client: Socket) {
        const mapRoom = Object.keys(client.rooms).filter(name => name.indexOf('map.') === 0)[0] || ''
        return mapRoom.split('.')[1]
    }
}

