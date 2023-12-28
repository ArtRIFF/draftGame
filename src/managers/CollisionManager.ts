import { UnitControl } from '../controls/UnitControl'
import { ModelControl } from '../controls/ModelControl'
import { EventEmitter } from '../engine/utilities/EventEmitter'

export class CollisionManager {
  private targetObject!: UnitControl
  private collisionObjectArray!: ModelControl[]
  private collisionEventEmitter: EventEmitter = new EventEmitter()

  update() {
    this.checkCollision()
  }

  private checkCollision() {
    for (const collisionObject of this.collisionObjectArray) {
      const collisionThresholdZ = collisionObject.objectSize.deep * 0.8
      const collisionThresholdX = Math.floor(
        this.targetObject.objectSize.width / 3
      )

      const isObjOnCenter =
        this.targetObject.x > -collisionThresholdX &&
        this.targetObject.x < collisionThresholdX
      const isObjOnRight = this.targetObject.x >= collisionThresholdX
      const isObjOnLeft = this.targetObject.x <= -collisionThresholdX

      const isZCollision =
        this.targetObject.z <= collisionObject.z + collisionThresholdZ &&
        this.targetObject.z > collisionObject.z
      const isXCollision =
        (isObjOnRight && collisionObject.x > 0) ||
        (isObjOnLeft && collisionObject.x < 0) ||
        (isObjOnCenter && collisionObject.x === 0)

      if (isZCollision && isXCollision) {
        this.collisionEventEmitter.emit('onCollision')
      }
    }
  }

  addObjects(targetObject: UnitControl, collisionObjectArray: ModelControl[]) {
    this.targetObject = targetObject
    this.collisionObjectArray = collisionObjectArray
  }

  onCollision(func: () => void) {
    this.collisionEventEmitter.on('onCollision', func)
  }
}
