import { Experience } from '../engine/Experience'
import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Resource } from '../engine/Resources'
import { Box } from '../demo/Box'
import { Object3D, Vector3 } from 'three'
import { toogleHelpers } from '../signals/signals'
import { Obstacle } from '../controls/Obstacle'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

export class MainGameScene implements Experience {
  resources: Resource[] = []
  private unit: Box = new Box()
  private obstacle: Obstacle = new Obstacle()
  private animationStep = 0.5
  private unitVector: Vector3 = new Vector3()
  private gridHelper: Object3D = new THREE.GridHelper(100, 50)
  private lightHelper: Object3D
  private axes: Object3D = new THREE.AxesHelper(100)
  private world: CANNON.World
  private gravityDebugger: CannonDebugger
  private timeStep: number = 1 / 60

  constructor(private engine: Engine) {
    toogleHelpers.on('onShowHelpers', () => this.showHelpers())
    toogleHelpers.on('onHideHelpers', () => this.hideHelpers())
  }

  init() {
    this.addGravity()
    this.engine.camera.rotate = false
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
    this.world.addBody(cubeBody)
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
    this.world.step(this.timeStep)
    this.gravityDebugger.update()
    this.unit.position.z += this.unitVector.z
    this.unit.position.x += this.unitVector.x
    this.unitVector.multiplyScalar(0.8)
    this.updateCamera()
  }

  updateCamera() {
    this.engine.camera.instance.position.z = this.unit.position.z + 10
    this.engine.camera.instance.position.y = this.unit.position.y + 5
    this.engine.camera.instance.position.x = this.unit.position.x + 2
  }

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

  addGravity() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.8, 0)
    this.initGravityDebugger()
  }

  initGravityDebugger() {
    this.gravityDebugger = new CannonDebugger(this.engine.scene, this.world, {
      onInit(body, mesh) {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'f') {
            console.log('HI')
            mesh.visible = !mesh.visible
          }
        })
      },
    })
  }
}
