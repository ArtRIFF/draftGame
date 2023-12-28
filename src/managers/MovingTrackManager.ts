import gsap from 'gsap'
import { ModelControl } from '../controls/ModelControl'
import { Engine } from '../engine/Engine'
import { getRandomValue } from '../helpers/getRandomValue'

export class MovingTrackManager {
  private trackObjectArray: ModelControl[] = []
  private objectAmount: number = 2
  private startZ: number = 0
  private possibleX = [-3, 0, 3]
  private gsapAnimationArray: GSAPTween[] = []
  private trackLength: number = 0

  constructor(private engine: Engine) {}

  addToStartPosition(obstacle: ModelControl) {
    const randomX = getRandomValue<number>(this.possibleX)
    obstacle.setPosition(randomX, 1.1, this.startZ + obstacle.objectSize.deep)
  }

  addTrackObjects() {
    for (let i = 0; i < this.objectAmount; i++) {
      const obstacleModel = this.engine.resources.getItem('Obstacle')
      const copyModel = { ...obstacleModel }
      copyModel.scene = obstacleModel.scene.clone(true)
      const obstacle = new ModelControl(copyModel)
      obstacle.setRotation(0, Math.PI / 2)
      obstacle.setScale(3, 3, 3)
      this.addToStartPosition(obstacle)
      obstacle.addToScene(this.engine.scene)
      this.trackObjectArray.push(obstacle)
    }
  }

  startMoveTrack() {
    if (this.gsapAnimationArray.length !== 0) {
      this.gsapAnimationArray.forEach((animation) => {
        animation.play()
      })
    } else {
      this.trackObjectArray.forEach((trackObject, index) => {
        const gsapAnimation = gsap
          .to(trackObject, {
            z: `+=${this.trackLength - trackObject.objectSize.deep}`,
            duration: 7,
            delay: index * 1.5,
            ease: 'power1.inOut',
            onRepeat: () => {
              this.addToStartPosition(trackObject)
            },
            onComplete: () => {
              this.addToStartPosition(trackObject)
            },
            repeat: -1,
          })
          .play()
        this.gsapAnimationArray.push(gsapAnimation)
      })
    }
  }

  async stopMoveTrack() {
    if (this.gsapAnimationArray.length !== 0) {
      this.gsapAnimationArray.forEach((animation) => {
        animation.pause()
      })
    }
  }

  setTrackParameters(startZ: number, trackLength: number) {
    this.startZ = startZ
    this.trackLength = trackLength
  }

  getTrackObjectArray(): ModelControl[] {
    return this.trackObjectArray
  }
}
