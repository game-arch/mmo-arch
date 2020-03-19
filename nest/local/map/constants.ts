import * as path from "path"
import * as glob from "glob"

export const maps = glob.sync(path.resolve(__dirname, '../../../shared/maps/*.js'))
                        .map(dir => dir.split('/').pop().split('.')[0])
                        .sort()

export class MapConstants {
    static readonly MAP = maps[process.env.NODE_APP_INSTANCE] || maps[0]
}
