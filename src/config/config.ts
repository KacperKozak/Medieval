import { createConfig } from './lib/createConfig'
import { colorInput } from './lib/definitions'

export const { config, resetConfig, saveConfig } = createConfig({
    core: {
        tickTime: 200,
        devTilesSize: 60,
        orbitalControls: false,
        cameraFov: 60,
        cameraFar: 350,
        cameraNear: 0.1,
    },

    debug: {
        logSelected: true,
        groundWireframe: true,
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
        light: false,
    },

    walkableRenderer: {
        movementSmoothness: 3,
        rotationSmoothness: 3,
    },

    barracks: {
        hp: 1000,
    },

    house: {
        hp: 1000,
        newChildCountMin: 10,
        newChildCountMax: 30,
    },

    tree: {
        hp: 300,
        removeTickCount: 10,
        newTreeTicksMin: 50,
        newTreeTicksMax: 10000,
        newTreeRange: [-3, -2, 2, 3],
    },

    boar: {
        hp: 80,
        randomWalkChance: 0.01,
        attackDistance: 1.5,
        lookEnemyDistance: 8,
        attackDamage: 3,
    },

    human: {
        hp: 100,
        randomWalkChance: 0.01,
        walkAroundHomeDistance: 7,
        attackDistance: 1.5,
        attackDamage: 5,
        color: colorInput(0xe0ac69),
    },

    woodcutter: {
        hp: 100,
        choppingDamage: 20,
        gatheringSpeed: 5,
        capacity: 50,
        attackDamage: 15,
        color: colorInput(0x00ff00),
    },

    guardian: {
        hp: 100,
        attackDamage: 25,
        color: colorInput(0x40ff70),
    },
})
