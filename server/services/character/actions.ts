export class CreateCharacter {
  static readonly event = 'character.create';

  constructor(
    public accountId: number,
    public world: string,
    public name: string,
    public gender: 'male' | 'female',
  ) {}
}

export class CharacterCreated {
  static readonly event = 'character.created';

  constructor(public world: string, public characterId: number) {}
}

export class CharacterNotCreated {
  static readonly event = 'character.not_created';

  constructor(
    public error: {
      statusCode: number;
    },
  ) {}
}

export class GetCharacters {
  static readonly event = 'character.get_all';

  constructor(public accountId: number, public world: string) {}
}

export class GetCharacter {
  static readonly event = 'character.get';

  constructor(public characterId: number) {}
}

export class GetCharacterName {
  static readonly event = 'character.get_name';

  constructor(public characterId: number) {}
}

export class CharacterOnline {
  static readonly event = 'character.online';

  constructor(public characterId: number, public socketId: string) {}
}

export class CharacterLoggedIn {
  static readonly event = 'character.logged_in';

  constructor(
    public characterId: number,
    public name: string,
    public world: string,
    public gender: 'male' | 'female',
  ) {}
}

export class CharacterLoggedOut {
  static readonly event = 'character.logged_out';

  constructor(
    public characterId: number,
    public name: string,
    public world: string,
  ) {}
}

export class CharacterOffline {
  static readonly event = 'character.offline';

  constructor(public socketId: string) {}
}

export class AllCharactersOffline {
  static readonly event = 'character.all_offline';

  constructor(public characters: CharacterOffline[]) {}
}
