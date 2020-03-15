export enum EffectTypes {
    // Overall max health or mana
    MAX_HEALTH           = 'max-health',
    MAX_MANA             = 'max-mana',

    // Affects any actions that recover health or mana
    HEALTH_RECOVERY      = 'health-recovery',
    MANA_RECOVERY        = 'mana-recovery',

    // Passive regenerative properties
    HEALTH_REGEN         = 'health-regen',
    MANA_REGEN           = 'mana-regen',

    // Stats impact (could be negative to tip the scales)
    STRENGTH             = 'strength',
    DEXTERITY            = 'dexterity',
    AGILITY              = 'agility',
    VITALITY             = 'vitality',
    INTELLIGENCE         = 'intelligence',
    WISDOM               = 'wisdom',
    CHARISMA             = 'charisma',

    // Physical attributes
    PHYSICAL_ATTACK      = 'physical-attack',
    PHYSICAL_DEFENSE     = 'physical-defense',
    PHYSICAL_ACCURACY    = 'physical-accuracy',
    PHYSICAL_EVASION     = 'physical-evasion',

    // Magical attributes
    MAGIC_ATTACK         = 'magic-attack',
    MAGIC_DEFENSE        = 'magic-defense',
    MAGIC_ACCURACY       = 'magic-accuracy',
    MAGIC_EVASION        = 'magic-evasion',

    // Damage types (for armor the potency is resistance, for weapons it is damage)
    PIERCE               = 'pierce',
    BLUNT                = 'blunt',
    SLASH                = 'slash',

    // Armor category in case we implement some kind of set bonuses based on armor type
    LEATHER              = 'leather',
    CLOTH                = 'cloth',
    HEAVY                = 'heavy',

    // Elemental property (when adding damage to a weapon, it changes the attributes of the attack)
    FIRE_DAMAGE          = 'fire-damage',
    EARTH_DAMAGE         = 'earth-damage',
    WATER_DAMAGE         = 'water-damage',
    LIGHTNING_DAMAGE     = 'lightning-damage',
    ICE_DAMAGE           = 'ice-damage',
    WIND_DAMAGE          = 'wind-damage',
    DARKNESS_DAMAGE      = 'darkness-damage',
    LIGHT_DAMAGE         = 'light-damage',
    FIRE_RESISTANCE      = 'fire-resistance',
    EARTH_RESISTANCE     = 'earth-resistance',
    WATER_RESISTANCE     = 'water-resistance',
    LIGHTNING_RESISTANCE = 'lightning-resistance',
    ICE_RESISTANCE       = 'ice-resistance',
    WIND_RESISTANCE      = 'wind-resistance',
    DARKNESS_RESISTANCE  = 'darkness-resistance',
    LIGHT_RESISTANCE     = 'light-resistance',

    // BUFFS and AILMENTS
    ATTACK_SPEED         = 'attack-speed',
    CAST_SPEED           = 'cast-speed',
    SKILL_COOL_DOWN      = 'skill-cool-down',
    // When a skill or weapon is used with this, it will heal the user of it
    HEALTH_RECOVERED     = 'health-recovered',
    MANA_RECOVERED       = 'mana-recovered',
    

}
