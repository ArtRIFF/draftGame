import gsap from 'gsap';
import { ModelControl } from '../controls/ModelControl';
import { Engine } from '../engine/Engine';
import { getRandomValue } from '../helpers/getRandomValue';
import * as SkeletonUtils from '../helpers/SkeletonUtils';
import promiseHelper, { ResolvablePromise } from '../helpers/ResolvablePromise';

export class MovingTrackManager {
  private trackObjectArray: ModelControl[] = [];
  private objectAmount: number = 2;
  private startZ: number = 0;
  private possibleX = [-3, 0, 3];
  private gsapAnimationArray: GSAPTween[] = [];
  private trackLength: number = 0;
  private trackSpeedDuration: number = 7;
  private completedMovePromise: ResolvablePromise<void> | null = null;

  constructor(private engine: Engine) {}

  addToStartPosition(obstacle: ModelControl) {
    const randomX = getRandomValue<number>(this.possibleX);
    const randomYRotation = getRandomValue<number>([
      Math.PI / 4,
      Math.PI / 2,
      Math.PI,
    ]);
    obstacle.setRotation(0, randomYRotation);
    obstacle.setPosition(randomX, 1.6, this.startZ + obstacle.objectSize.deep);
  }

  addTrackObjects() {
    for (let i = 0; i < this.objectAmount; i++) {
      const obstacleModel = this.engine.resources.getItem('Obstacle');
      const copyModel = { ...obstacleModel };
      copyModel.scene = SkeletonUtils.clone(obstacleModel.scene);
      const obstacle = new ModelControl(copyModel);
      obstacle.setRotation(0, Math.PI / 2);
      obstacle.setScale(3, 3, 3);
      this.addToStartPosition(obstacle);
      obstacle.addToScene(this.engine.primaryScene);
      this.trackObjectArray.push(obstacle);
    }
  }

  async startMoveTrack(
    duration: number = this.trackSpeedDuration,
    repeatMove: number = 1
  ): Promise<void> {
    this.gsapAnimationArray = [];
    this.completedMovePromise = promiseHelper.getResolvablePromise<void>();
    this.trackObjectArray.forEach((trackObject, index) => {
      this.addToStartPosition(trackObject);
      const gsapAnimation = gsap.to(trackObject, {
        z: `+=${this.trackLength - trackObject.objectSize.deep}`,
        duration: duration,
        delay: index * 1.5,
        ease: 'power1.inOut',
        onComplete: () => {
          this.addToStartPosition(trackObject);
          if (index === this.objectAmount - 1) {
            this.completedMovePromise!.resolve();
          }
        },
        repeat: repeatMove,
      });
      gsapAnimation.play();
      this.gsapAnimationArray.push(gsapAnimation);
    });

    return await this.completedMovePromise;
  }

  private speedUpObstacles(duration: number) {
    this.gsapAnimationArray.forEach((anim) => anim.duration(duration));
  }

  async stopMoveTrack() {
    if (this.gsapAnimationArray.length !== 0) {
      this.gsapAnimationArray.forEach((animation) => {
        animation.pause();
      });
    }
  }

  setTrackParameters(startZ: number, trackLength: number) {
    this.startZ = startZ;
    this.trackLength = trackLength;
  }

  getTrackObjectArray(): ModelControl[] {
    return this.trackObjectArray;
  }
}
