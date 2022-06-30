import { WalkableActor } from '+game/core/WalkableActor'
import { Tile } from '+game/Tile'
import { ActorType } from '+game/types'

import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

import { ActorRenderer } from '../../renderer/lib/ActorRenderer'

export class LumberjackActorRenderer extends ActorRenderer<WalkableActor> {
    public actorType = ActorType.Lumberjack

    private material = new MeshStandardMaterial({ color: 0xff4070 })
    private geometry = new SphereGeometry(0.5, 5, 4)

    public createActorModel(actor: WalkableActor, tile: Tile) {
        const { group, interactionShape } = super.createActorModel(actor, tile)
        const body = new Mesh(this.geometry, this.material)

        body.castShadow = true
        body.receiveShadow = true
        body.scale.y = 2
        body.position.y = 0.5

        group.add(body)

        return { group, interactionShape }
    }
}
