import { ConfigForm } from '+components/config/ConfigForm'
import { GuardianActor } from '+game/actors/guardian/GuardianActor'
import { LumberjackActor } from '+game/actors/lumberjack/LumberjackActor'
import { LumberjackCabinActor } from '+game/actors/lumberjack/LumberjackCabinActor'
import { TreeActor } from '+game/actors/tree/TreeActor'
import { Actor } from '+game/core/Actor'
import { ActorStatic } from '+game/core/ActorStatic'
import { Game } from '+game/Game'
import { Renderer } from '+game/Renderer'
import { FootpathTile, InsideTile, WallTile } from '+game/Tile'
import { Position } from '+game/types'
import { Word } from '+game/Word'
import { seededRandom } from '+helpers/random'
import styled from '@emotion/styled'
import {
    Button,
    ButtonGroup,
    createTheme,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    ThemeProvider,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { createTileGrid } from './lib/createTileGrid'

const word = new Word()
const game = new Game(word)
const renderer = new Renderer(game)

const buildings = {
    LumberjackCabin: ([x, y]: Position) => {
        const cabin = new LumberjackCabinActor(game, [x + 2, y + 2])
        const lumberjack = new LumberjackActor(game, [x, y], cabin)

        game.addActor(cabin)
        game.addActor(lumberjack)

        const currTail = game.word.getTile([x, y])

        const createWallTile = () => {
            const instance = new WallTile()
            instance.height = currTail.height
            return instance
        }

        const createFootpathTile = () => {
            const instance = new FootpathTile()
            instance.height = currTail.height
            return instance
        }

        const createInsideTile = () => {
            const instance = new InsideTile()
            instance.height = currTail.height
            return instance
        }

        game.word.setTiles((tiles) => {
            createTileGrid(
                {
                    '.': createFootpathTile,
                    'W': createWallTile,
                    '!': createInsideTile,
                },
                [
                    ['.', '.', '.', '.', '.'],
                    ['.', 'W', 'W', 'W', '.'],
                    ['.', 'W', '!', 'W', '.'],
                    ['.', 'W', '!', 'W', '.'],
                    ['.', '.', '.', '.', '.'],
                ],
                ([localX, localY], tileFn) => {
                    tiles[y + localY][x + localX] = tileFn()
                },
            )
        })
    },

    Tree: ([x, y]: Position) => {
        game.addActor(new TreeActor(game, [x, y]))
    },

    Guardian: ([x, y]: Position) => {
        game.addActor(new GuardianActor(game, [x, y]))
    },
}

const rng = seededRandom(1234567)

game.word.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
        if (tile.canWalk && rng() < tile.treeChance) {
            game.addActor(new TreeActor(game, [x, y]))
        }
    })
})

const anyWindow = window as any
anyWindow.game = game

anyWindow.logStats = () => {
    console.log('Scene polycount:', renderer.webGLRenderer.info.render.triangles)
    console.log('Active Drawcalls:', renderer.webGLRenderer.info.render.calls)
    console.log('Textures in Memory', renderer.webGLRenderer.info.memory.textures)
    console.log('Geometries in Memory', renderer.webGLRenderer.info.memory.geometries)
}

type BuildingKey = keyof typeof buildings
const buildingList = Object.keys(buildings) as BuildingKey[]

function App() {
    const rendererRef = useRef<HTMLDivElement>(null)
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingKey>()
    const [selectedActor, setSelectedActor] = useState<Actor | ActorStatic>()

    const [, frameCount] = useState(0)
    const render = () => frameCount((n) => n + 1)

    useEffect(() => {
        game.start()
        renderer.init(rendererRef.current!)
        render()

        const vrButton = VRButton.createButton(renderer.webGLRenderer)
        vrButton.style.position = 'absolute'
        vrButton.style.top = '10px'
        vrButton.style.zIndex = '1000'
        vrButton.style.height = '50px'

        document.body.appendChild(vrButton)

        buildings.Guardian([100, 120])
        buildings.LumberjackCabin([107, 120])
        buildings.LumberjackCabin([117, 100])

        return () => {
            game.stop()
        }
    }, [])

    useEffect(() => {
        const hendleClick = (event: MouseEvent): void => {
            if (selectedBuilding) {
                const position = renderer.findPositionByMouseEvent(event)
                if (!position) return

                const currTail = game.word.getTile(position)
                if (currTail.canBuild) {
                    buildings[selectedBuilding](position)
                }
            } else {
                const actor = renderer.selectByMouseEvent(event)
                if (actor) {
                    setSelectedActor(actor)
                } else {
                    const position = renderer.findPositionByMouseEvent(event)
                    if (!position || !selectedActor) return
                    if (selectedActor instanceof Actor) {
                        selectedActor.goTo(position)
                    }
                }
            }
        }

        rendererRef.current?.addEventListener('click', hendleClick)

        return () => {
            rendererRef.current?.removeEventListener('click', hendleClick)
        }
    }, [selectedBuilding, selectedActor])

    const isRunning = game.isRunning()

    return (
        <ThemeProvider theme={darkTheme}>
            <Bottom>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                isRunning ? game.stop() : game.start()
                                render()
                            }}
                        >
                            {isRunning ? 'Stop' : 'Start'}
                        </Button>
                        {!isRunning && <Button onClick={() => game.tick()}>Tick</Button>}
                    </ButtonGroup>

                    <FormControl style={{ minWidth: 200 }}>
                        <InputLabel>Actor</InputLabel>
                        <Select
                            value={selectedBuilding || ''}
                            onChange={(e) => {
                                setSelectedBuilding(e.target.value as BuildingKey)
                            }}
                        >
                            <MenuItem value="">-</MenuItem>
                            {buildingList.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedActor && <b>{selectedActor.type}</b>}
                </Stack>
            </Bottom>

            <Right>
                <ConfigForm onChange={() => render()} />
            </Right>

            <RendererDiv ref={rendererRef} />
        </ThemeProvider>
    )
}

const darkTheme = createTheme({
    palette: { mode: 'dark' },
})

const Bottom = styled.div({
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 0 40px -10px rgba(0, 0, 0, 0.3)',
})

const Right = styled.div({
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '20px',
    backdropFilter: 'blur(15px)',
    maxWidth: '250px',
    width: '90%',
    transform: 'translateX(100%) translateX(-20px)',
    transition: 'transform 1s ease 0.8s',
    boxShadow: '0 0 40px -10px rgba(0, 0, 0, 0.3)',
    ':hover': {
        transform: 'translateX(0%)',
        transition: 'transform 0.35s ease',
    },
    ':after': {
        content: '""',
        position: 'absolute',
        left: '8px',
        top: 0,
        bottom: 0,
        height: '15px',
        width: '4px',
        border: '1px solid rgba(255, 255, 255, 0.596)',
        borderWidth: '0 1px 0 1px',
        margin: 'auto',
    },
})

const RendererDiv = styled.div({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    'canvas': {},
})

export default App
