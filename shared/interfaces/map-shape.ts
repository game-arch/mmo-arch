
import Shape = Phaser.GameObjects.Shape
import {CollisionConfig, TransitionConfig} from "./map-config";
export interface MapShape extends Shape {
    collision?: CollisionConfig
    transition?:TransitionConfig
}
