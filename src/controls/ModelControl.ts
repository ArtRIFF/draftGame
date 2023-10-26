import { Scene } from 'three'

export class ModelControl {
  constructor(protected model: any) {}

  addToScene(scene: Scene) {
    scene.add(this.model.scene)
  }

  setPosition(x: number, y: number, z: number) {
    this.model.scene.position.set(x, y, z)
  }

  setScale(x: number, y: number, z: number) {
    this.model.scene.scale.set(x, y, z)
  }

  setRotation(x: number = 0, y: number = 0, z: number = 0) {
    this.model.scene.rotation.x = x
    this.model.scene.rotation.y = y
    this.model.scene.rotation.z = z
  }

  update(delta: number) {}
}
