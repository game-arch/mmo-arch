export class WorldConstants {
    static readonly NAME          = process.env.WORLD_NAME || 'Maiden'
    static readonly CONSTANT      = process.env.WORLD_CONSTANT || 'maiden'
    static readonly DB_NAME       = (process.env.WORLD_CONSTANT || 'maiden').replace(/-/g, '_')
    static readonly PING_TIMEOUT  = 60 * 1000
    static readonly PING_INTERVAL = 30 * 1000
}
