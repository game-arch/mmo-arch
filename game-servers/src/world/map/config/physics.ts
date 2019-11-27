export class Physics {
    static readonly CLIENT_SPEED_BASE = 9;
    static readonly SERVER_SPEED_BASE = 1.5;
    static readonly SPEED_MODIFIER    = 10;

}

export class CollisionGroup {
    static readonly PLAYER = Math.pow(2, 0);
    static readonly WALL   = Math.pow(2, 1);
    static readonly NPC    = Math.pow(2, 2);
}

export class CollisionMask {

    static readonly PLAYER = CollisionGroup.WALL | CollisionGroup.NPC;
    static readonly NPC    = CollisionGroup.WALL | CollisionGroup.PLAYER;
    static readonly WALL   = CollisionGroup.PLAYER | CollisionGroup.NPC;
}
