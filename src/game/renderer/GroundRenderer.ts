import { config } from '+config'
import { Game } from '+game/Game'
import { getPositionByIndex, HorizontalPlaneGeometry } from '+helpers'

import {
    BufferAttribute,
    Color,
    DoubleSide,
    Mesh,
    MeshStandardMaterial,
    RepeatWrapping,
    TextureLoader,
    Vector2,
} from 'three'

import { BasicRenderer } from './lib/BasicRenderer'
import { createWordPlane } from './lib/createWordPlane'
// import hdrUrl from './textures/sand/TexturesCom_Ground_SandRoughSliding1_1x1_512_roughness.tif'
// tif not working
import colorUrl from './textures/test4color.png'
// import aoUrl from './textures/muddy/TexturesCom_Sand_Muddy3_3x3_1K_ao.jpg'
import heightUrl from './textures/test4height.png'
import normalUrl from './textures/test4normal.png'

// import roughnessUrl from './textures/muddy/TexturesCom_Sand_Muddy3_3x3_1K_roughness.jpg'

export class GroundRenderer extends BasicRenderer {
    private groundMesh?: Mesh
    private groundMaterial: MeshStandardMaterial
    private geometry?: HorizontalPlaneGeometry

    constructor(public game: Game) {
        super()

        this.geometry = createWordPlane(this.game.world, config.renderer.diagonals)

        const count = this.geometry.attributes.position!.count
        this.geometry.setAttribute(
            'color',
            new BufferAttribute(new Float32Array(count * 3), 3),
        )

        this.groundMaterial = new MeshStandardMaterial({
            side: DoubleSide,
            metalness: 0.1,
            roughness: 0.9,
            vertexColors: true,
            flatShading: true,
        })

        const loader = new TextureLoader()

        const textureScale = 50

        const [sizeX, sizeY] = this.game.world.getSize()

        if (config.renderer.texture) {
            loader.load(colorUrl, (texture) => {
                texture.wrapS = RepeatWrapping
                texture.wrapT = RepeatWrapping
                texture.repeat.set(sizeX / textureScale, sizeY / textureScale)
                this.groundMaterial.map = texture
            })
            // loader.load(normalUrl, (texture) => {
            //     texture.wrapS = RepeatWrapping
            //     texture.wrapT = RepeatWrapping
            //     texture.repeat.set(sizeX / textureScale, sizeY / textureScale)
            //     this.groundMaterial.normalMap = texture
            //     this.groundMaterial.normalScale = new Vector2(0.12, 0.12)
            // })
            loader.load(heightUrl, (texture) => {
                texture.wrapS = RepeatWrapping
                texture.wrapT = RepeatWrapping
                texture.repeat.set(sizeX / textureScale, sizeY / textureScale)
                this.groundMaterial.bumpMap = texture
                this.groundMaterial.bumpScale = 0.005
            })
            // loader.load(aoUrl, (texture) => {
            //     texture.wrapS = RepeatWrapping
            //     texture.wrapT = RepeatWrapping
            //     texture.repeat.set(sizeX / textureScale, sizeY / textureScale)
            //     this.groundMaterial.aoMap = texture
            //     this.groundMaterial.aoMapIntensity = 0.2
            // })
            // loader.load(roughnessUrl, (texture) => {
            //     texture.wrapS = RepeatWrapping
            //     texture.wrapT = RepeatWrapping
            //     texture.repeat.set(sizeX / textureScale, sizeY / textureScale)

            //     this.groundMaterial.roughnessMap = texture
            //     this.groundMaterial.metalnessMap = texture

            //     // rain
            //     // groundMaterial.roughness = 0.2
            //     // groundMaterial.metalness = 0.1

            //     // normal
            //     this.groundMaterial.roughness = 1.1
            //     // groundMaterial.metalness = 0.1
            // })
        }

        this.groundMesh = new Mesh(this.geometry, this.groundMaterial)
        this.groundMesh.receiveShadow = true
        this.group.add(this.groundMesh)

        if (config.debug.groundWireframe) {
            const groundWireframeMaterial = new MeshStandardMaterial({
                color: 0x000000,
                wireframe: true,
                transparent: true,
                opacity: 0.05,
                depthWrite: false,
            })

            const wireframeMesh = new Mesh(
                this.groundMesh.geometry,
                groundWireframeMaterial,
            )

            wireframeMesh.renderOrder = 1
            wireframeMesh.receiveShadow = true
            wireframeMesh.position.y = 0.01
            this.group.add(wireframeMesh)
        }

        this.game.world.emitter.on('tailUpdate', () => {
            this.render()
        })
    }

    public init() {
        this.render()
    }

    public render() {
        if (!this.groundMesh || !this.geometry) return

        const [wordWidth] = this.game.world.getSize()

        const position = this.groundMesh.geometry.attributes.position!
        const colors = this.geometry.attributes.color!
        const color = new Color()

        for (let i = 0; i < position.count; i++) {
            const tile = this.game.world.getTile(getPositionByIndex(i, wordWidth))
            position.setY(i, tile.height * config.renderer.tileSize)
            color.setHex(tile.color)
            colors.setXYZ(i, color.r, color.g, color.b)
            colors.needsUpdate = true
        }

        position.needsUpdate = true
    }
}
