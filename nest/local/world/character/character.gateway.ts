import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Namespace, Socket }                                   from 'socket.io'
import { WorldService }                                        from '../world.service'
import { Logger }                                              from '@nestjs/common'
import { WorldConstants }                                      from '../../../lib/constants/world.constants'
import { CharacterClient }                                     from '../../character/client/character.client'
import {
    CharacterCreated,
    CharacterNotCreated,
    CharacterOffline,
    CharacterOnline,
    CreateCharacter,
    GetCharacter,
    GetCharacters
}                                                              from '../../../../shared/events/character.events'
import { Character }                                           from '../../character/entities/character'
import { InjectRepository }                                    from '@nestjs/typeorm'
import { Player }                                              from '../entities/player'
import { Repository }                                          from 'typeorm'
import * as parser                                             from 'socket.io-msgpack-parser'
import { AllNpcs, AllPlayers, MapOnline }                      from '../../../../shared/events/map.events'
import { MapClient }                                           from '../../map/client/map.client'

@WebSocketGateway({
    namespace   : 'world',
    pingInterval: WorldConstants.PING_INTERVAL,
    pingTimeout : WorldConstants.PING_TIMEOUT,
    parser
})
export class CharacterGateway {
    @WebSocketServer()
    server: Namespace

    constructor(
        @InjectRepository(Player)
        private players: Repository<Player>,
        private logger: Logger,
        private map: MapClient,
        private service: WorldService,
        private character: CharacterClient
    ) {

    }


    async sendCharacters(data: MapOnline) {
        const players = await this.players.find({
            instance: Number(process.env.NODE_APP_INSTANCE),
            channel : data.channel
        })
        for (const player of players) {
            if (player.characterId) {
                await this.character.characterOnline(player.characterId, player.socketId)
            }
        }
        this.server.to('map.' + data.map + '.' + data.channel).emit(AllPlayers.event, new AllPlayers(data.map, await this.map.getAllPlayers(data.map, data.channel)))
        this.server.to('map.' + data.map + '.' + data.channel).emit(AllNpcs.event, new AllNpcs(data.map, await this.map.getAllNpcs(data.map, data.channel)))
    }

    @SubscribeMessage(CreateCharacter.event)
    async createCharacter(client: Socket, data: { name: string, gender: 'male' | 'female' }) {
        try {
            const player = await this.players.findOne({ socketId: client.id })
            if (player) {
                const character: Character = await this.service.createCharacter(player.accountId, data.name, data.gender)
                if (character) {
                    client.emit(GetCharacters.event, await this.service.getCharacters(player.accountId))
                    client.emit(CharacterCreated.event, new CharacterCreated(character.world, character.id))
                    return character
                }
            }
            client.emit(CharacterNotCreated.event)
            return null
        } catch (e) {
            client.emit(CharacterNotCreated.event, new CharacterNotCreated(e.response))
            return null
        }
    }

    @SubscribeMessage(CharacterOnline.event)
    async characterJoined(client: Socket, character: CharacterOnline) {
        try {
            await this.service.storeCharacter(client, character)
            return { status: 'success' }
        } catch (e) {
            console.log(e)
            return { status: 'error' }
        }
    }

    @SubscribeMessage(GetCharacter.event)
    async getCharacter(client: Socket, characterId: number) {
        try {
            return await this.character.getCharacter(characterId)
        } catch (e) {
            console.log(e)
            return null
        }
    }

    @SubscribeMessage(CharacterOffline.event)
    async characterLeft(client: Socket) {
        try {
            await this.service.removeCharacter(client)
            return { status: 'success' }
        } catch (e) {
            console.log(e)
            return { status: 'error' }
        }
    }
}
