import { Builder } from '+game/Builder'
import { Game } from '+game/Game'
import { Renderer } from '+game/Renderer'

import { RaycastFinder } from './lib/RaycastFinder'

export class BuildInteractions {
    private builder: Builder
    private finder: RaycastFinder
    private el: HTMLCanvasElement

    constructor(public game: Game, public renderer: Renderer) {
        this.el = this.renderer.webGLRenderer.domElement
        this.builder = new Builder(game)
        this.finder = new RaycastFinder(game, renderer)
    }

    public addEventListeners() {
        this.el.addEventListener('click', this.handleClick)
        this.el.addEventListener('contextmenu', this.handleContextmenu)
    }

    public removeEventListeners() {
        this.el.removeEventListener('click', this.handleClick)
        this.el.removeEventListener('contextmenu', this.handleContextmenu)
    }

    private handleClick = (event: MouseEvent) => {
        event.preventDefault()

        const selectedBuilding = this.game.player.selectedBuilding
        if (!selectedBuilding) return

        const position = this.finder.findPositionByMouseEvent(event)
        if (!position) return

        this.builder.spawn(selectedBuilding, position)
    }

    private handleContextmenu = (event: MouseEvent) => {
        event.preventDefault()
        this.game.player.unselectBuilding()
    }
}
