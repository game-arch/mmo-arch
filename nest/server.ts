import * as glob from 'glob'
import * as path from 'path'

glob.sync(path.resolve(__dirname, './global/*/main'))
glob.sync(path.resolve(__dirname, './local/*/main'))
