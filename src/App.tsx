import { ConfigItem } from '+componets/config/ConfigItem'
import { config, configOptions } from '+config'
import { Lumberjack } from '+game/actors/Lumberjack'
import { LumberjackCabin } from '+game/actors/LumberjackCabin'
import { Tree } from '+game/actors/Tree'
import { Game } from '+game/Game'
import { Renderer } from '+game/Renderer'
import { Position } from '+game/types'
import { Word } from '+game/Word'
import styled from '@emotion/styled'
import { entries, toPairs } from 'lodash'
import { useEffect, useRef, useState } from 'react'

const game = new Game(new Word())
const renderer = new Renderer(game)

const tree = new Tree(game, [1, 1])
game.addActor(tree)
tree.hit(9999)

game.addActor(new Tree(game, [3, 3]))
game.addActor(new Tree(game, [6, 6]))
game.addActor(new Tree(game, [16 - 1, 14 - 1]))
game.addActor(new Tree(game, [10, 0]))
game.addActor(new Tree(game, [12, 2]))
game.addActor(new Tree(game, [6, 5]))
game.addActor(new Tree(game, [11, 13]))

const buildings = {
    LumberjackCabin: ([x, y]: Position) => {
        const cabin = new LumberjackCabin(game, [x, y])
        const lumberjack = new Lumberjack(game, [x - 1, y], cabin)

        game.addActor(cabin)
        game.addActor(lumberjack)
    },
    Tree: ([x, y]: Position) => {
        game.addActor(new Tree(game, [x, y]))
    },
}

buildings.LumberjackCabin([8, 12])

type BuildingKey = keyof typeof buildings
const buildingList = Object.keys(buildings) as BuildingKey[]

function App() {
    const rendererRef = useRef(null)
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingKey>(buildingList[0])

    const [, frameCount] = useState(0)
    const render = () => frameCount((n) => n + 1)

    useEffect(() => {
        game.start()
        const unsubscribe = game.subscribe((type) => {
            console.log('---', type)
            render()
        })

        renderer.init(rendererRef.current!)

        return () => {
            game.stop()
            unsubscribe()
        }
    }, [])

    const isRunning = game.isRunning()

    return (
        <>
            <Top>
                <button
                    onClick={() => {
                        isRunning ? game.stop() : game.start()
                        render()
                    }}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>

                {!isRunning && <button onClick={() => game.tick()}>Tick</button>}

                <select
                    value={selectedBuilding}
                    onChange={(e) => {
                        setSelectedBuilding(e.target.value as BuildingKey)
                    }}
                >
                    {buildingList.map((building) => (
                        <option key={building} value={building}>
                            {building}
                        </option>
                    ))}
                </select>
            </Top>

            <Right>
                {toPairs(configOptions).map(([categoryKey, category]) => {
                    const configCategory = (config as any)[categoryKey]
                    return (
                        <details key={categoryKey}>
                            <summary>{categoryKey}</summary>
                            {entries(category).map(([key, definition]) => (
                                <div key={key}>
                                    {key}
                                    <ConfigItem
                                        value={configCategory[key]}
                                        definition={definition}
                                        onChange={(value) => {
                                            configCategory[key] = value
                                            render()
                                        }}
                                    />
                                </div>
                            ))}
                        </details>
                    )
                })}
            </Right>

            <RendererDiv ref={rendererRef} />

            {/* <div className="word">
                <div className="word-origin">
                    {game.word.tiles.map((row, y) => (
                        <TileRow
                            key={y}
                            tiles={row}
                            y={y}
                            onClick={(position) => {
                                buildings[selectedBuilding]?.(position)
                            }}
                        />
                    ))}
                    {game.actors.map((actor) => (
                        <ActorView key={actor.id} actor={actor} />
                    ))}
                </div>
            </div> */}
        </>
    )
}

const Top = styled.div({
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px',
})

const Right = styled.div({
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px',
})

const RendererDiv = styled.div({
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    'canvas': {},
})

export default App
