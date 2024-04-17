import { Box3, Mesh, Scene } from 'three'
import { Model } from "../types/GameTypes";

export class ModelControl
{
	constructor(protected model: Model)
	{
		model.scene.traverse((object: any) =>
		{
			if (object instanceof Mesh)
			{
				object.castShadow = true;
				object.receiveShadow = true;
			}
		})
	}

	addToScene(scene: Scene)
	{
		scene.add(this.model.scene);
	}

	setPosition(x: number, y: number, z: number)
	{
		this.model.scene.position.set(x, y, z);
	}

	set x(value: number)
	{
		this.model.scene.position.x = value;
	}

	set y(value: number)
	{
		this.model.scene.position.y = value;
	}

	set z(value: number)
	{
		this.model.scene.position.z = value;
	}

	get x()
	{
		return this.model.scene.position.x;
	}

	get y()
	{
		return this.model.scene.position.y;
	}

	get z()
	{
		return this.model.scene.position.z;
	}

	setScale(x: number, y: number, z: number)
	{
		this.model.scene.scale.set(x, y, z);
	}

	setRotation(x: number = 0, y: number = 0, z: number = 0)
	{
		this.model.scene.rotation.x = x;
		this.model.scene.rotation.y = y;
		this.model.scene.rotation.z = z;
	}

	get objectSize(): { width: number; height: number; deep: number }
	{
		const box = new Box3().setFromObject(this.model.scene);
		return {
			width: box.max.x - box.min.x,
			height: box.max.y - box.min.y,
			deep: box.max.z - box.min.z,
		}
	}
}
