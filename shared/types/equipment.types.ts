export enum ArmorParts {
    HEAD  = 'head',
    UPPER = 'upper',
    LOWER = 'lower'
}

export enum ArmorTypes {
    LIGHT  = 'light',
    MEDIUM = 'medium',
    HEAVY  = 'heavy'
}

export enum WeaponTypes {
    DAGGER       = 'dagger',
    AXE          = 'axe',
    HAMMER       = 'hammer',
    SWORD        = 'sword',
    GREAT_SWORD  = 'great-sword',
    GREAT_AXE    = 'great-axe',
    GREAT_HAMMER = 'great-hammer',
    STAFF        = 'staff',
    SPEAR        = 'spear',
    CLUB         = 'club',
    BOW          = 'bow',

    SHIELD       = 'shield'
}

export const TWO_HANDED: WeaponTypes[] = [WeaponTypes.GREAT_SWORD, WeaponTypes.GREAT_HAMMER, WeaponTypes.GREAT_AXE, WeaponTypes.SPEAR, WeaponTypes.STAFF]
