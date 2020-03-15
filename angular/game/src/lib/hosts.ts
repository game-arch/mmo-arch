import { environment } from '../environments/environment'

export class Hosts {
    static readonly LOBBY = {
        index : 0,
        name  : 'lobby',
        host  : environment.host,
        port  : environment.port,
        status: 'online' as 'online' | 'offline',
        url   : environment.server
    }
}
