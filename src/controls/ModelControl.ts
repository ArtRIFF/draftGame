import { Mesh, Scene } from 'three'

export class ModelControl {
  constructor(protected model: any) {
    this.model.scene.traverse((object: any) => {
      if (object instanceof Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }

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

  get objectSize(): { width: number; height: number; deep: number } {
    return this.findGeometryParam(this.model.scene)
  }

  private findGeometryParam(objectParent: any): {
    width: number
    height: number
    deep: number
  } {
    const childrenCount = objectParent.children.length
    const objectChild = objectParent.children[0]
    if (childrenCount === 0) {
      return {
        width: 0,
        height: 0,
        deep: 0,
      }
    } else if (!objectChild.hasOwnProperty('geometry')) {
      return this.findGeometryParam(objectChild)
    } else {
      const box = objectChild.geometry.boundingBox
      return {
        width: box?.max.x - box?.min.x,
        height: box?.max.y - box?.min.y,
        deep: box?.max.z - box?.min.z,
      }
    }
  }
}
