import { WebGLRenderer } from "three";
import { Engine } from "./Engine";
import * as THREE from "three";
import { GameEntity } from "./GameEntity";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export class RenderEngine implements GameEntity
{
	private readonly renderer: WebGLRenderer;
	composer: EffectComposer;
	secondaryComposer: EffectComposer;

	constructor(private engine: Engine)
	{
		this.renderer = new WebGLRenderer({
			canvas: this.engine.canvas,
			antialias: true,
		});
		this.renderer.autoClear = false;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.CineonToneMapping;
		this.renderer.toneMappingExposure = 1.75;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setClearColor("#000000");
		this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height);
		this.renderer.setPixelRatio(Math.min(this.engine.sizes.pixelRatio, 2));
		this.composer = new EffectComposer(this.renderer);
		this.secondaryComposer = new EffectComposer(this.renderer);

		const renderPass = new RenderPass(
			this.engine.primaryScene,
			this.engine.perspectiveCamera.instance
		);

		const renderPass2 = new RenderPass(
			this.engine.secondaryScene,
			this.engine.orthographicCamera.instance
		);

		this.secondaryComposer.addPass(renderPass2);
		this.composer.addPass(renderPass);
	}

	update()
	{
		this.renderer.render(
			this.engine.primaryScene,
			this.engine.perspectiveCamera.instance
		);
		this.renderer.render(
			this.engine.secondaryScene,
			this.engine.orthographicCamera.instance
		);
	}

	resize()
	{
		this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height);
		this.composer.setSize(this.engine.sizes.width, this.engine.sizes.height);
		this.secondaryComposer.setSize(
			this.engine.sizes.width,
			this.engine.sizes.height
		);
		this.secondaryComposer.render();
		this.composer.render();
	}
}
