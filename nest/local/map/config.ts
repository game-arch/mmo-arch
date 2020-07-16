import { TUTORIAL_CONFIG }   from '../../../shared/maps/tutorial'
import { TUTORIAL_2_CONFIG } from '../../../shared/maps/tutorial-2'
import { MapConfig }         from '../../../shared/interfaces/map-config'

export const MAPS: { [key: string]: MapConfig } = {
    tutorial    : TUTORIAL_CONFIG,
    'tutorial-2': TUTORIAL_2_CONFIG
}
