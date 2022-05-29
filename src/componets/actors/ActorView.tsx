import { config } from '+config/config'
import { ActorStatic } from '+game/core/ActorStatic'
import { actorTypeColors } from '+game/types'
import styled from '@emotion/styled'
import { Hp } from './Hp'

interface ActorViewProps {
    actor: ActorStatic
}

export const ActorView = ({ actor }: ActorViewProps) => {
    const {
        id,
        type,
        hp,
        maxHp,
        position: [x, y],
        ...rest
    } = actor

    return (
        <Container
            key={id}
            style={{
                left: `${x * config.core.devTilesSize}px`,
                top: `${y * config.core.devTilesSize}px`,
                backgroundColor: actorTypeColors[type],
            }}
            isDead={actor.isDead()}
            onClick={() => {
                console.log(actor.debug())
            }}
        >
            {(rest as any).state && <Status>{(rest as any).state}</Status>}
            <Name>{type}</Name>
            <Debug>{actor.debug()}</Debug>
            <Hp hp={hp} maxHp={maxHp} />
        </Container>
    )
}

const d = 0.75

const Container = styled.div<{ isDead: boolean }>(({ isDead }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: config.core.devTilesSize * d,
    height: config.core.devTilesSize * d,
    backgroundColor: 'rgb(221, 0, 255)',
    transformStyle: 'preserve-3d',
    transition: 'all 200ms linear',
    transform: `translate3d(${config.core.devTilesSize * ((1 - d) / 2)}px, ${
        config.core.devTilesSize * ((1 - d) / 2)
    }px, ${isDead ? 2 : (config.core.devTilesSize * d) / 2}px) rotateX(${
        isDead ? 0 : -90
    }deg) rotateY(0deg) rotateZ(0deg)`,
}))

const Name = styled.div({
    position: 'absolute',
    color: 'white',
    textAlign: 'center',
    top: -20,
    left: -50,
    right: -50,
    fontSize: 13,
})

const Status = styled.div({
    position: 'absolute',
    textAlign: 'center',
    bottom: 0,
    left: -50,
    right: -50,
    fontSize: '0.8em',
})

const Debug = styled.div({
    fontSize: '0.3em',
    whiteSpace: 'pre',
})
