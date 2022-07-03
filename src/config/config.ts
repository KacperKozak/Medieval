// ha ha
import { createConfig } from './lib/createConfig'
import { colorInput, minMaxNumber, select } from './lib/definitions'

export const { config, resetConfig, saveConfig } = createConfig({
    core: {
        tickTime: 200,
        devTilesSize: 60,
        orbitalControls: false,
    },

    renderer: {
        tileSize: 1,
        fog: true,
        fogTransparency: 3,
        dayAndNightMode: true,
        dayAndNightTimeScale: 500,
        dayAndNightTimeStart: -500,
        shadow: true,
        treeWaving: true,
        wireframe: true,
    },

    pathfinding: {
        actorOnSameTileCost: 3,
        enableDiagonals: true,
        enableCornerCutting: true,
    },

    tree: {
        hp: 300,
        removeTickCount: 10,
        newTreeTicksMin: 50,
        newTreeTicksMax: 10000,
        newTreeRange: [-3, -2, 2, 3],
    },

    lumberjack: {
        hp: 100,
        choppingDamage: 20,
        gatheringSpeed: 5,
        capacity: 50,
        cabinLight: false,
    },

    guardian: {
        hp: 100,
    },

    configTest: {
        bool: false,
        number: 20,
        string: 'Hello',
        select: select('first', ['first', 'second', 'third']),
        minMax: minMaxNumber(100, 1, 1000),
        color: colorInput(0xabc123),
    },
})
