import { config } from '+config/config'
import { ActorStatic } from '+game/core/ActorStatic'
import { ActorType, Position } from '+game/types'
import { randomArrayItem } from '+helpers/array'
import { random } from '+helpers/basic'

export class Tree extends ActorStatic {
    public type = ActorType.Tree
    public maxHp = config.tree.hp
    public hp = config.tree.hp

    private newTreeCount = this.treeCount()

    public tick(): void {
        this.newTreeCount--
        if (this.newTreeCount <= 0) {
            this.newTreeCount = this.treeCount()

            this.plantNewTree()
        }
    }

    public plantNewTree() {
        const newTreePosition = this.position.map(
            (pos) => randomArrayItem(config.tree.newTreeRange) + pos,
        ) as Position

        const tile = this.game.word.getTile(newTreePosition)

        if (!tile?.walkable) return

        this.game.addActor(new Tree(this.game, newTreePosition))
    }

    private treeCount() {
        const { min, max } = config.tree.newTreeTicks
        return random(min, max)
    }
}
