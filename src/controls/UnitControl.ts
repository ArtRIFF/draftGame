;``
import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce } from 'three'
import { ModelControl } from './ModelControl'
import gsap from 'gsap'

export class UnitControl extends ModelControl {
  private animationMixer: AnimationMixer
  private mainActiveAnimation!: AnimationAction
  private animations: AnimationAction[] = []
  private _step: number = 1

  constructor(model: any) {
    super(model)
    this.animationMixer = new AnimationMixer(this.model.scene)
    this.addAnimationActions()
    this.activateAllActions()
  }

  private addAnimationActions() {
    this.model.animations.map((animationClip: AnimationClip) => {
      this.animations.push(this.animationMixer.clipAction(animationClip))
    })
  }

  run() {
    this.startAction('Run', true)
  }

  stop() {
    this.startAction('Idle', true)
  }

  hit() {
    this.startAction('Header', false)
  }

  win() {
    this.startAction('Victory', true)
  }

  fall() {
    this.startAction('Death', false)
  }

  private startAction(actionName: string, loop: boolean) {
    const runAction = this.getActionByName(actionName)
    const mainActiveClip = this.mainActiveAnimation.getClip()
    if (actionName !== mainActiveClip.name) {
      const option = {
        duration: 1,
        loop: loop,
      }
      this.executeCrossFade(runAction, option)
    }
  }

  private getActionByName(name: string): AnimationAction {
    return this.animations.find((animationAction) => {
      const clip = animationAction.getClip()
      return clip.name === name
    })!
  }

  private activateAllActions() {
    this.animations.forEach((animation) => {
      const clip = animation.getClip()
      const animationName = clip.name
      if (animationName === 'Idle') {
        this.setWeight(animation, 1)
        this.mainActiveAnimation = animation
      } else {
        this.setWeight(animation, 0)
      }
      animation.play()
    })
  }

  private setWeight(action: AnimationAction, weight: number) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }

  private executeCrossFade(
    action: AnimationAction,
    option: {
      duration: number
      loop: boolean
    }
  ) {
    this.setWeight(action, 1)
    action.time = 0
    this.mainActiveAnimation.crossFadeTo(action, option.duration, true)
    if (!option.loop) {
      action.clampWhenFinished = true
      action.setLoop(LoopOnce, 1)
      action.stop()
      action.play()
    }
    this.mainActiveAnimation = action
  }

  update(delta: number) {
    this.animationMixer.update(delta)
  }

  set step(stepValue: number) {
    this._step = stepValue
  }

  moveLeft() {
    this.horizonMove('left')
  }

  moveRight() {
    this.horizonMove('right')
  }

  private horizonMove(direction: 'left' | 'right') {
    const directionValue: number = direction === 'left' ? 1 : -1
    const currentPositionX = this.model.scene.position.x
    const destinationX =
      currentPositionX === directionValue * this._step
        ? 0
        : directionValue * -this._step
    gsap
      .to(this.model.scene.position, {
        x: destinationX,
        duration: 1,
        ease: 'power1.inOut',
      })
      .play()
  }
}

;``
