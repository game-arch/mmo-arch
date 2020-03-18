export const maps = ['tutorial', 'tutorial-2']

export class MapConstants {
    static readonly MAP = maps[process.env.NODE_APP_INSTANCE] || maps[0]
}
