import { isServer }         from '../constants/environment-constants'
import { Physics }          from '../phaser/physics'

export const DEFAULT_DELAY = 2500
export const RAPID_DELAY   = 500
export const MEDIUM_DELAY  = 1000
export const SINGLES       = 1
export const DOUBLES       = 2
export const TRIPLES       = 3
export const COMMANDS      = {
    push      : {
        count     : SINGLES,
        delay     : DEFAULT_DELAY,
        projectile: {
            duration: 500,
            speed   : 3,
            growTo  : 5,
            type    : 'cone',
            key     : 'rain',
            onTargetHit(projectile:any, target: any) {
                if (isServer) {
                    projectile.disableMovement(target)
                    let velocity = projectile.config.type === 'central' ? Physics.velocityFromDifference(projectile.x, projectile.y, target.x, target.y) : projectile.body.velocity
                    target.body.setVelocity(velocity.x, velocity.y)
                    target.onVelocityChange()
                }
            }
        }
    },
    shootArrow: {
        count     : SINGLES,
        delay     : RAPID_DELAY,
        projectile: {
            duration       : 1000,
            speed          : 5,
            growTo         : 1.1,
            type           : 'bullet',
            key            : 'rain',
            destroyOnTarget: true
        }
    }
}
