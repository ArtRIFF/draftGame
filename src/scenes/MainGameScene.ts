import { Experience } from '../engine/Experience'
import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Resource } from '../engine/Resources'
import { Box } from '../demo/Box'
import { AnimationMixer, Object3D, Vector3 } from 'three'
import { toogleHelpers } from '../signals/signals'
import { Obstacle } from '../controls/Obstacle'
import * as CANNON from 'cannon-es'

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
  private unit: Box = new Box()
  private obstacle: Obstacle = new Obstacle()
  private animationStep = 0.5
  private unitVector: Vector3 = new Vector3()
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
    let cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    let cubeBody = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(10) })
    cubeBody.addShape(cubeShape)
    cubeBody.position.set(0, 1, 5)
    this.lightHelper = new THREE.DirectionalLightHelper(directionalLight)
    this.engine.scene.add(directionalLight, this.gridHelper, this.obstacle)
    this.unit.add(this.lightHelper, this.axes)
    this.hideHelpers()
    this.unit.castShadow = true
    this.unit.rotation.y = Math.PI
    this.unit.position.set(0, 0.5, 20)
    this.engine.scene.add(this.unit)
    window.addEventListener('keydown', (e) => {
      this.onChangePosition(e.key)
    })

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
    this.unit.position.z += this.unitVector.z
    this.unit.position.x += this.unitVector.x
    this.unitVector.multiplyScalar(0.8)
    this.updateCamera()
  }

  updateCamera() {}

  onChangePosition(key: string) {
    if (key === 'w') {
      this.unitVector.z -= this.animationStep
    }
    if (key === 's') {
      this.unitVector.z += this.animationStep
    }
    if (key === 'd') {
      this.unitVector.x += this.animationStep
    }
    if (key === 'a') {
      this.unitVector.x -= this.animationStep
    }
  }
}
