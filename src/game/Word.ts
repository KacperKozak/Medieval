import { uuid } from '+helpers/basic'
import PubSub from '+lib/PubSub'
import { Position } from './types'
import Map from './maps/TestMapBig'

export class Word extends PubSub<'tailUpdate'> {
    // prettier-ignore
    public tiles: Tile[][] = Map.map((row:string[]) => row.map((v:string) => shortcuts[v]()))

    // public tiles: Tile[][] = [
    //     ['.', '.', '.'],
    //     ['.', '.', '.'],
    //     ['.', '.', '.'],Tile[][]
    // ].map((row) => row.map((v) => shortcuts[v]()))

    public tick() {}

    public getTile([x, y]: Position) {
        return this.tiles?.[y]?.[x]
    }

    public setTile([x, y]: Position, tile: Tile) {
        this.tiles[y][x] = tile
        this.publish('tailUpdate', [x, y], tile)
    }

    public getSize() {
        return [this.tiles[0].length, this.tiles.length]
    }
}

export abstract class Tile {
    public id = uuid()
    public name: string = 'Tile'
    public walkable: boolean = true
    public color = 0x000000
    public height = 0
    public treeChance = 0
}

class ForestTile extends Tile {
    public name = 'Forest'
    public color = 0x033d09
    public treeChance = 0.2
}

class MeadowTile extends Tile {
    public name = 'Meadow'
    public color = 0x00660a
    public treeChance = 0.01
}

class StepTile extends Tile {
    public name = 'Step'
    public color = 0xbfaa34
    public height = 2
    public treeChance = 0.005
}

class WaterTile extends Tile {
    public name = 'Water'
    public walkable = false
    public color = 0xbdb675
    public height = -1
}

export class BuildingTile extends Tile {
    public name = 'Building'
    public walkable = true
    public color = 0x474738
    public height = 0
}

const shortcuts = {
    '.': () => new MeadowTile(),
    '#': () => new StepTile(),
    'F': () => new ForestTile(),
    'W': () => new WaterTile(),
} as any
