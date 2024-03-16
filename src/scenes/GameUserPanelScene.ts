import * as THREE from 'three'
import { Object3D, Sprite, SpriteMaterial, TextureLoader } from 'three'
import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'

export class GameUserPanelScene implements Experience {
  resources: Resource[] = []
  private gridHelper: Object3D = new THREE.GridHelper(100, 100)
  private sprite!: Sprite

  constructor(private engine: Engine) {
    this.gridHelper.rotation.x = Math.PI / 2
  }

  public init(): void {
    this.setCamera()
    this.setLight()
    const map = new TextureLoader().load('../../assets/Tutorial_Hand.png')
    const material = new SpriteMaterial({
      map: map,
    })
    this.sprite = new Sprite(material)
    this.engine.scene.add(this.sprite)
  }

  private setCamera() {
    this.engine.camera.instance.position.set(0, 0, 10)
  }
  private setLight() {
    this.engine.scene.add(this.gridHelper)
  }

  public update(): void {}
}
