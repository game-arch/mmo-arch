
import Shape = Phaser.GameObjects.Shape
import {CollisionConfig} from "./map-config";
export interface MapShape extends Shape {
    config?: CollisionConfig
}
