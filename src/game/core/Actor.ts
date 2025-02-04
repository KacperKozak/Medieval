import { Game } from '+game/Game'
import { Player } from '+game/player/types'
import { ActorType, Position } from '+game/types'
import { ClassType, maxValue, randomSeed, uuid } from '+helpers'

export abstract class Actor {
    public id = uuid()
    public type: ActorType = ActorType.Empty
    /**
     * 5 → Very important unit like soldier
     * 4 → Walkable actors
     * 3 → Default
     * 2 → Small and less important actors eg tree
     * 1 → Buildings because they are quite big
     */
    public selectImportance = 3
    public maxHp = 100
    public hp = this.maxHp
    public hpRegen = 1
    public seed = randomSeed()
    public rotation = 0

    constructor(
        public game: Game,
        public player: Player,
        public position: Position = [0, 0],
    ) {}

    public tick(): void {
        if (this.hp < this.maxHp) {
            this.hp = Math.min(this.hp + this.hpRegen, this.maxHp)
        }
    }

    public death(): void {
        this.game.removeActor(this)
    }

    public hitBy(actor?: Actor): void {}

    public hit(damage: number, byActor?: Actor): number {
        if (this.isDead()) return 0

        const maxHit = maxValue(this.hp, damage)
        this.hp -= maxHit

        if (!this.hp) this.death()

        this.hitBy(byActor)

        return maxHit
    }

    public isDead(): boolean {
        return this.hp <= 0
    }

    public interact(actors: Actor[]): boolean {
        return false
    }

    public getSelectedImportance(): number {
        return this.selectImportance
    }

    public setRotation(rotation: number): void {
        this.rotation = rotation
    }

    public toJSON(): ActorJSON {
        return {
            id: this.id,
            type: this.type,
            playerId: this.player.id,
            position: this.position,
            hp: this.hp,
            maxHp: this.maxHp,
            hpRegen: this.hpRegen,
            selectImportance: this.selectImportance,
            seed: this.seed,
            rotation: this.rotation,
        }
    }

    public fromJSON(json: ActorJSON): void {
        Object.assign(this, json)
    }
}

export interface ActorJSON {
    id: string
    type: ActorType
    playerId: string
    position: Position
    hp: number
    maxHp: number
    hpRegen: number
    selectImportance: number
    seed: number
    rotation: number
}

export type ActorClass<T extends Actor = Actor> = ClassType<
    T,
    ConstructorParameters<typeof Actor>
>
