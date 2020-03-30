import { Item }                   from '../entities/item'
import { ItemTypes }              from '../../../../shared/types/item.types'
import { Armor }                  from '../entities/armor'
import { ArmorParts, ArmorTypes } from '../../../../shared/types/equipment.types'

export const ARMORS: Item[] = [
    Item.create({
        type    : ItemTypes.EQUIPMENT,
        constant: 'heavy-upper-armor-1',
        armor   : Armor.create({
            name        : 'Test Armor',
            part        : ArmorParts.UPPER,
            type        : ArmorTypes.HEAVY,
            style       : 'heavy-upper-armor-1',
            color       : 0xff2200,
            gemSlotCount: 2
        })
    })
]
