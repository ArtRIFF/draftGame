import { Experience } from '../engine/Experience'
import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Resource } from '../engine/Resources'
import { Object3D } from 'three'
import { emitUnitAction, toogleHelpers } from '../signals/signals'
import { Obstacle } from '../controls/Obstacle'
import { UnitControl } from '../controls/UnitControl'
import { ModelControl } from '../controls/ModelControl'

export class MainGameScene implements Experience {
  resources: Resource[] = [
    {
      name: 'BrainMan',
      type: 'gltf',
      path: '../../assets/BrainMan.glb',
    },
    {
      name: 'Brain',
      type: 'gltf',
      path: '../../assets/Brain.glb',
    },
    {
      name: 'TrackFloor',
      type: 'gltf',
      path: '../../assets/TrackFloor.glb',
    },
  ]
  private obstacle: Obstacle = new Obstacle()
  private gridHelper: Object3D = new THREE.GridHelper(100, 50)
  private lightHelper!: Object3D
  private axes: Object3D = new THREE.AxesHelper(100)
  private unit!: UnitControl
  private trackFloor!: ModelControl

  constructor(private engine: Engine) {
    toogleHelpers.on('onShowHelpers', () => this.showHelpers())
    toogleHelpers.on('onHideHelpers', () => this.hideHelpers())
    emitUnitAction.on('onUnitRun', () => this.unit.run())
    emitUnitAction.on('onUnitStop', () => this.unit.stop())
    emitUnitAction.on('onUnitHit', () => this.unit.hit())
    emitUnitAction.on('onUnitWin', () => this.unit.win())
    emitUnitAction.on('onUnitFall', () => this.unit.fall())
  }

  init() {
    this.engine.camera.rotate = true
    this.engine.scene.add(new THREE.AmbientLight(0xcfe518, 0.5))
    let directionalLight = new THREE.DirectionalLight(0x1882e5, 1)
    directionalLight.castShadow = true
    directionalLight.position.set(2, 2, 2)
    this.obstacle.position.set(0, 1.1, 5)
    this.lightHelper = new THREE.DirectionalLightHelper(directionalLight)
    this.engine.scene.add(directionalLight, this.gridHelper, this.obstacle)
    this.hideHelpers()
    const trackFloorModel = this.engine.resources.getItem('TrackFloor')
    const brainManModel = this.engine.resources.getItem('BrainMan')
    this.trackFloor = new ModelControl(trackFloorModel)
    this.trackFloor.addToScene(this.engine.scene)
    this.trackFloor.setPosition(0, 0, 30)
    this.trackFloor.setScale(1, 1, 3)
    this.unit = new UnitControl(brainManModel)
    this.unit.setPosition(0, 0.1, 20)
    this.unit.setRotation(0, Math.PI, 0)
    this.unit.addToScene(this.engine.scene)
    this.engine.camera.instance.position.set(5, 10, 30)
    if (localStorage.getItem('isHelpersVisible') === 'true') {
      this.showHelpers()
    }
  }

  resize() {}

  hideHelpers() {
    this.axes.visible = false
    this.gridHelper.visible = false
    this.lightHelper.visible = false
  }

  showHelpers() {
    this.axes.visible = true
    this.gridHelper.visible = true
    this.lightHelper.visible = true
  }

  update(delta: number) {
    this.unit.update(delta)
    this.updateCamera()
  }

  updateCamera() {}
}
