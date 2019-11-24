export class WorldConstants {
    static readonly NAME      = process.env.WORLD_NAME;
    static readonly CONSTANT  = process.env.WORLD_CONSTANT;
    static readonly DB_PREFIX = process.env.WORLD_CONSTANT.replace(/-/g, '_');
}
