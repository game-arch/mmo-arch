import { Component } from '@angular/core'
import { ConnectionManager } from '../../connection/connection-manager'

@Component({
    selector: 'hud',
    templateUrl: 'hud.component.html',
})
export class HudComponent {
    constructor(public connection: ConnectionManager) {}

    get world() {
        return this.connection.world
    }
}
