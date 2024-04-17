import promiseHelper, { ResolvablePromise } from '../helpers/ResolvablePromise'
import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce } from 'three'
import { Model } from "../types/GameTypes";
import { ModelControl } from './ModelControl'
import gsap from 'gsap'

export class UnitControl extends ModelControl
{
	private animationMixer: AnimationMixer;
	private mainActiveAnimation!: AnimationAction;
	private animations: AnimationAction[] = [];
	private _step: number = 1;
	private finishCurrentActionPromise!: ResolvablePromise<void>;

	constructor(model: Model)
	{
		super(model);
		this.animationMixer = new AnimationMixer(this.model.scene);
		this.addAnimationActions();
		this.activateAllActions();
		this.animationMixer.addEventListener('finished', () =>
		{
			this.finishCurrentActionPromise.resolve();
		})
	}

	private addAnimationActions()
	{
		this.model.animations.map((animationClip: AnimationClip) =>
		{
			this.animations.push(this.animationMixer.clipAction(animationClip));
		})
	}

	async run()
	{
		await this.startAction('Run', true);
	}

	async stop()
	{
		await this.startAction('Idle', true);
	}

	async hit()
	{
		await this.startAction('Header', false);
	}

	async win()
	{
		await this.startAction('Victory', true);
	}

	async fall()
	{
		await this.startAction('Death', false);
	}

	async moveLeft()
	{
		await this.horizonMove('left');
	}

	async moveRight()
	{
		await this.horizonMove('right');
	}

	private async startAction(actionName: string, loop: boolean)
	{
		const runAction = this.getActionByName(actionName);
		const mainActiveClip = this.mainActiveAnimation.getClip();
		if (actionName !== mainActiveClip.name)
		{
			this.finishCurrentActionPromise?.resolve();
			this.executeCrossFade(runAction, {duration: 1, loop: loop,});
			this.finishCurrentActionPromise = promiseHelper.getResolvablePromise();
			await this.finishCurrentActionPromise;
		}
	}

	private getActionByName(name: string): AnimationAction
	{
		return this.animations.find((animationAction) =>
		{
			const clip = animationAction.getClip();
			return clip.name === name;
		})!
	}

	private activateAllActions()
	{
		this.animations.forEach((animation) =>
		{
			const clip = animation.getClip();
			const animationName = clip.name;
			if (animationName === 'Idle')
			{
				this.setWeight(animation, 1);
				this.mainActiveAnimation = animation;
			}
			else
			{
				this.setWeight(animation, 0);
			}
			animation.play();
		})
	}

	private setWeight(action: AnimationAction, weight: number)
	{
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
	}

	private executeCrossFade(
		action: AnimationAction,
		option: {
      duration: number;
      loop: boolean;
    }
	)
	{
		this.setWeight(action, 1)
		action.time = 0;
		this.mainActiveAnimation.crossFadeTo(action, option.duration, true);
		if (!option.loop)
		{
			action.clampWhenFinished = true;
			action.setLoop(LoopOnce, 1);
			action.stop();
			action.play();
		}
		this.mainActiveAnimation = action;
	}

	update(delta: number)
	{
		this.animationMixer.update(delta);
	}

	set step(stepValue: number)
	{
		this._step = stepValue;
	}

	private async horizonMove(direction: 'left' | 'right')
	{
		const directionValue: number = direction === 'left' ? 1 : -1;
		const currentPositionX = this.model.scene.position.x;
		const destinationX =
      currentPositionX === directionValue * this._step ? 0 : directionValue * -this._step
		await gsap
			.to(this.model.scene.position, {
				x: destinationX,
				duration: 1,
				ease: 'power1.inOut',
			})
			.play();
	}
}
