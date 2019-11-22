import {HttpService, Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {RegisteredWorld}                                         from "./entities/registered-world";
import {Repository}                                              from "typeorm";
import {InjectRepository}                                        from "@nestjs/typeorm";
import {ConnectedUser}                                           from "./entities/connected-user";
import {from, of, Subject}                                       from "rxjs";
import {catchError, map, mergeMap, tap, toArray}                 from "rxjs/operators";
import {WebSocketServer}                                         from "@nestjs/websockets";
import {Server}                                                  from "socket.io";
import {PresenceClient}                                          from "./client/presence.client";
import {ServerPresence}                                          from "./server.presence";
import {CharacterPresence}                                       from "./character.presence";

@Injectable()
export class UserPresence {

    constructor(
        private server: ServerPresence,
        @InjectRepository(RegisteredWorld)
        private repo: Repository<RegisteredWorld>,
        @InjectRepository(ConnectedUser)
        private userRepo: Repository<ConnectedUser>,
        private logger: Logger,
        private client: PresenceClient
    ) {
    }

    async online(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                let connected = new ConnectedUser(accountId, registeredWorld.name, serverId);
                await this.userRepo.delete({accountId});
                await this.userRepo.save(connected, {reload: true});
                await this.repo.save(registeredWorld);
                this.client.sendServers(await this.server.getServers());
                return connected.id
            }
            throw new Error("World Not Found");
        } catch (e) {
            this.logger.error(e);
            return null;
        }
    }

    async offline(serverId: number, accountId: number) {
        try {
            let registeredWorld = await this.repo.findOne(serverId);
            if (registeredWorld) {
                await this.userRepo.delete({accountId});
                await this.repo.save(registeredWorld);
                this.client.sendServers(await this.server.getServers());
                return "OK";
            }
            throw new Error("World Not Found: " + serverId);
        } catch (e) {
            this.logger.error(e);
            return "ERROR";
        }
    }

    async getUser(accountId: number) {
        try {
            let user = await this.userRepo.findOne({accountId});
            if (user) {
                return user;
            }
            throw new Error("User Not Found: " + accountId);
        } catch (e) {
            this.logger.error(e);
            return null;
        }
    }

}
