import { config } from '+config'
import { Actor } from '+game/core/Actor'
import { Game } from '+game/Game'
import { Renderer } from '+game/Renderer'
import { Position } from '+game/types'

import { Intersection, Object3D, Raycaster, Vector2 } from 'three'

export class RaycastFinder {
    constructor(public game: Game, public renderer: Renderer) {}

    public findPositionByMouseEvent = (event: MouseEvent): Position | undefined => {
        const rayCaster = new Raycaster()
        const pointer = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        )
        rayCaster.setFromCamera(pointer, this.renderer.rtsCamera.camera)

        const intersects = rayCaster.intersectObjects(this.renderer.getGroundChildren())
        const intersectPoint = intersects[0]?.point

        if (!intersectPoint) return

        const [width, height] = this.game.world.getRealSize()

        const x = Math.round((intersectPoint.x + width / 2) / config.renderer.tileSize)
        const y = Math.round((intersectPoint.z + height / 2) / config.renderer.tileSize)

        return [x, y]
    }

    public findActorsByMouseEvent = (event: MouseEvent): Actor[] => {
        // TODO: Optimize intersectObjects execution
        const rayCaster = new Raycaster()
        const pointer = new Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        )
        rayCaster.setFromCamera(pointer, this.renderer.rtsCamera.camera)

        const interactionObjectList = this.renderer.getInteractionObjectList()

        const intersects = rayCaster.intersectObjects(
            interactionObjectList,
            false,
        ) as Intersection<Object3D<Event>>[]

        const intersectActors = intersects
            .map((intersect) => intersect.object.userData.actor as Actor)
            .filter((actor) => !!actor)

        const objectList: Object3D[] = []
        intersects.forEach((intersect) => {
            if (intersect && intersect.object && intersect.object.parent)
                objectList.push(intersect.object.parent as Object3D)
        })

        intersectActors.sort(
            (a, b) => b.getSelectedImportance() - a.getSelectedImportance(),
        )

        return intersectActors
    }

    public findSingleActorByMouseEvent(event: MouseEvent): Actor | undefined {
        const actors = this.findActorsByMouseEvent(event)

        if (!actors.length) return

        return actors.reduce((prev, current) => {
            if (!prev) return current
            return prev.getSelectedImportance() < current.getSelectedImportance()
                ? current
                : prev
        })
    }
}
