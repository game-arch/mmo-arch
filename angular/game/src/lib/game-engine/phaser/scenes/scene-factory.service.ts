import { Injectable }        from '@angular/core'
import { Location }          from '@angular/common'
import { ConnectionManager } from '../../../connection/connection-manager'
import { TitleScene }        from './title/title.scene'
import { TutorialScene }     from './tutorial/tutorial.scene'
import { PreloadScene }      from './preload/preload.scene'
import { Tutorial2Scene }    from './tutorial/tutorial2.scene'

@Injectable()
export class SceneFactory {
    constructor(
        private connection: ConnectionManager,
        private location: Location
    ) {
    }

    preload() {
        return new PreloadScene(this.location)
    }

    title() {
        return new TitleScene()
    }

    tutorial() {
        return new TutorialScene(this.connection)
    }

    tutorial2() {
        return new Tutorial2Scene(this.connection)
    }
}
