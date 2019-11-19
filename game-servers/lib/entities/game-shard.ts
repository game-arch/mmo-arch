export interface GameShard {
    id: number;
    socketId: string;
    host: string;
    port: string;
    name: string;
    capacity: number;
    current: number;
    status: 'online' | 'offline';
}
