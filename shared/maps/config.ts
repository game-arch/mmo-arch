import { TUTORIAL_CONFIG }   from './tutorial'
import { TUTORIAL_2_CONFIG } from './tutorial-2'
import { MapConfig }         from '../interfaces/map-config'

export const MAPS: { [key: string]: MapConfig } = {
    tutorial    : TUTORIAL_CONFIG,
    'tutorial-2': TUTORIAL_2_CONFIG
}
