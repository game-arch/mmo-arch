export interface GameCharacter {
    id: number;
    gender?: 'male' | 'female';
    name: string;
    stats?: GameCharacterStats;
    parameters?: GameCharacterParameters;
    equipmentSets?: GameCharacterEquipment[];
    activeEquipmentSet?: GameCharacterEquipment;
}

export interface GameCharacterStats {

}

export interface GameCharacterEquipment {

}

export interface GameCharacterParameters {

}
