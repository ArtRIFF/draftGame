import { Experience } from '../engine/Experience'
import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Resource } from '../engine/Resources'
import { AnimationMixer, Object3D } from 'three'
import { toogleHelpers } from '../signals/signals'
import { Obstacle } from '../controls/Obstacle'

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
  ]
  private obstacle: Obstacle = new Obstacle()
  private gridHelper: Object3D = new THREE.GridHelper(100, 50)
  private lightHelper!: Object3D
  private axes: Object3D = new THREE.AxesHelper(100)
  private brainMan!: any
  private mixer!: AnimationMixer

  constructor(private engine: Engine) {
    toogleHelpers.on('onShowHelpers', () => this.showHelpers())
    toogleHelpers.on('onHideHelpers', () => this.hideHelpers())
  }

  init() {
    this.engine.camera.rotate = true
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 100),
      new THREE.MeshStandardMaterial({ color: 0x4fa014 })
    )
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true
    this.engine.scene.add(plane)
    this.engine.scene.add(new THREE.AmbientLight(0xcfe518, 0.5))

    let directionalLight = new THREE.DirectionalLight(0x1882e5, 1)
    directionalLight.castShadow = true
    directionalLight.position.set(2, 2, 2)
    this.obstacle.position.set(0, 1, 5)
    this.lightHelper = new THREE.DirectionalLightHelper(directionalLight)
    this.engine.scene.add(directionalLight, this.gridHelper, this.obstacle)
    this.hideHelpers()

    this.brainMan = this.engine.resources.getItem('BrainMan')
    this.brainMan.scene.position.set(2, 0, 20)
    this.brainMan.scene.rotation.y = Math.PI
    this.engine.scene.add(this.brainMan.scene)
    this.engine.camera.instance.position.set(5, 10, 30)
    this.mixer = new THREE.AnimationMixer(this.brainMan.scene)
    this.mixer.clipAction(this.brainMan.animations[2]).play()
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
    this.mixer.update(delta)
    this.updateCamera()
  }

  updateCamera() {}
}
