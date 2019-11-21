export interface GameWorld {
    index: number;
    host: string;
    port: number;
    name: string;
    capacity: number;
    current: number;
    status: 'online' | 'offline';
}
