import { OrthographicCamera } from "three";
import { GameEntity } from "./GameEntity";

export class OrthoCamera implements GameEntity
{
	public instance!: OrthographicCamera;
	constructor()
	{
		this.initCamera();
	}
	update(): void
	{}

	private initCamera(): void
	{
		this.instance = new OrthographicCamera(
			window.innerWidth / -2,
			window.innerWidth / 2,
			window.innerHeight / 2,
			window.innerHeight / -2,
			0.1,
			1000
		);

		this.instance.zoom = 100;
		this.instance.updateProjectionMatrix();
	}

	resize()
	{
		this.instance.updateProjectionMatrix();
	}
}
