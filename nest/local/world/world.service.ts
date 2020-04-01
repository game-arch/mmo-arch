import { Injectable }        from '@nestjs/common'
import { AccountClient }     from '../../global/account/client/account.client'
import { Socket }            from 'socket.io'
import { CharacterClient }   from '../character/client/character.client'
import { WorldConstants }    from '../../lib/constants/world.constants'
import { MapClient }         from '../map/client/map.client'
import { Repository }        from 'typeorm'
import { Player }            from './entities/player'
import { InjectRepository } from '@nestjs/typeorm'
import { ChangeMapChannel } from '../../../shared/events/map.events'


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

    async storeCharacter(client: Socket, character: { id: number, name: string, instance:number }) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && character.id) {
                await this.validateCharacterLogin(player, character.id)
                await this.character.characterOnline(character.id, client.id, character.instance)
                player.characterId   = character.id
                player.characterName = await this.character.getCharacterName(character.id)
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

    async playerAttemptedTransition(client: Socket, instance?:number) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && player.characterId !== null) {
                this.map.playerAttemptedTransition(player.characterId, instance)
            }
        }
    }

    async changeInstance(client: Socket, data: ChangeMapChannel) {
        if (!this.shuttingDown) {
            const player = await this.players.findOne({ socketId: client.id })
            if (player && player.characterId !== null) {
                this.map.changeChannel(player.characterId, data.channel)
            }
        }
    }

    getMapOf(client: Socket) {
        const mapRoom = Object.keys(client.rooms).filter(name => name.indexOf('map.') === 0)[0] || ''
        return mapRoom.split('.')[1]
    }
}

