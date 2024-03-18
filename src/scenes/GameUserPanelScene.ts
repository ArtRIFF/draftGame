import * as THREE from 'three'
import { Object3D, Sprite, SpriteMaterial, TextureLoader } from 'three'
import { Engine } from '../engine/Engine'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'
import { toogleHelpers } from '../signals/signals'

export class GameUserPanelScene implements Experience {
  resources: Resource[] = []
  private gridHelper: Object3D = new THREE.GridHelper(100, 100)
  private sprite!: Sprite

  constructor(private engine: Engine) {}

  public init(): void {
    this.setCamera()
    this.gridHelper.rotation.x = Math.PI / 2
    this.engine.secondaryScene.add(this.gridHelper)
    const map = new TextureLoader().load('../../assets/Tutorial_Hand.png')
    const material = new SpriteMaterial({
      map: map,
    })
    this.sprite = new Sprite(material)
    this.sprite.position.set(-3, 3, 0)
    this.engine.secondaryScene.add(this.sprite)

    this.hideUIHelpers()
    if (localStorage.getItem('isUIHelpersVisible') === 'true') {
      this.showUIHelpers()
    }

    toogleHelpers.on('onShowUIHelpers', () => this.showUIHelpers())
    toogleHelpers.on('onHideUIHelpers', () => this.hideUIHelpers())
  }

  private setCamera() {
    this.engine.orthographicCamera.instance.position.set(0, 0, 10)
  }

  public update(): void {}

  private showUIHelpers(): void {
    this.gridHelper.visible = true
  }

  private hideUIHelpers(): void {
    this.gridHelper.visible = false
  }
}
