export interface GameWorld {
    index: number;
    host: string;
    port: number;
    name: string;
    status: 'online' | 'offline';
}
