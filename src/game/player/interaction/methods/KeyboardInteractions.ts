import { Game } from '+game/Game'
import { HumanPlayer } from '+game/player/HumanPlayer'
import { Renderer } from '+game/Renderer'
import { normalizeEventKeyName } from '+helpers'

export class KeyboardInteractions {
    // TODO move selection when holding space bar
    public isHoldingSpaceBar = false

    constructor(
        public game: Game,
        public renderer: Renderer,
        public player: HumanPlayer,
    ) {}

    public enable() {
        window.addEventListener('keyup', this.handleKeyUp)
        window.addEventListener('keydown', this.handleKeyDown)
    }

    public disable() {
        window.removeEventListener('keyup', this.handleKeyUp)
        window.removeEventListener('keydown', this.handleKeyDown)
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === ' ') {
            this.isHoldingSpaceBar = true
        }
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        const key = normalizeEventKeyName(event.key)

        switch (key) {
            case ' ':
                this.isHoldingSpaceBar = false
                break

            case 'Escape':
                this.player.unselectActor()
                this.player.unselectBuilding()
                break

            case 'r':
                this.player.rotateBuilding()
                break
        }
    }
}
