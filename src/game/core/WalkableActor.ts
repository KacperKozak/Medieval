import { Path, Position } from '+game/types'

import { Actor } from './Actor'

export abstract class WalkableActor extends Actor {
    public selectImportance = 4
    public path: Path = []

    public async setPathTo(position: Position) {
        const pathSearch = await this.game.pf.findPath(this.position, position)
        this.path = pathSearch
        return pathSearch
    }

    public cancelPath() {
        this.path = []
    }

    public hasPath() {
        return this.path.length > 0
    }

    public move() {
        const next = this.path.shift()

        if (next) {
            this.position = [next.x, next.y]
        }
    }
}
