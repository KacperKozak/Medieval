import { config } from '+config'
import { Tree } from '+game/actors/Tree'
import { Actor } from '+game/core/Actor'
import { ActorType, Position } from '+game/types'
import { Tile } from '+game/Word'
import {
    Clock,
    CylinderGeometry,
    DoubleSide,
    Group,
    Mesh,
    MeshStandardMaterial,
    PlaneGeometry,
    SphereGeometry,
} from 'three'
import { Game } from '../Game'
import { ActorRenderer } from './lib/ActorRenderer'
import { ItemRenderer } from './lib/ItemRenderer'

export class TreeRenderer extends ActorRenderer {
    public actorType = ActorType.Tree

    private boughMaterial = new MeshStandardMaterial({ color: 0x2e2625 })
    private branchesMaterial = new MeshStandardMaterial({ color: 0x00660a })
    private boughGeometry = new CylinderGeometry(0.2, 0.4, 3, 3)
    private branchesGeometry = new SphereGeometry(1.5, 5, 4)

    public render(clock: Clock) {
        Object.values(this.actorGroupRef).forEach(({ actor, group }) => {
            if (actor.isDead()) {
                group.rotation.x = Math.PI / 2.2
            }
        })
    }

    public createActorModel(actor: Actor, tile: Tile) {
        const group = super.createActorModel(actor, tile)

        const bough = new Mesh(this.boughGeometry, this.boughMaterial)
        const branches = new Mesh(this.branchesGeometry, this.branchesMaterial)

        bough.position.y = 3 / 2
        branches.position.y = 3 / 2 + 2

        bough.name = 'bough'
        branches.name = 'branches'
        group.add(bough)
        group.add(branches)

        return group
    }
}
