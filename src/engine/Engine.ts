import { Scene } from 'three'
import * as THREE from 'three'
import { OrthoCamera } from './OrthoCamera'
import { RenderEngine } from './RenderEngine'
import { RenderLoop } from './RenderLoop'
import { DebugUI } from './interface/DebugUI'
import { Sizes } from './Sizes'
import { Camera } from './Camera'
import { Resources } from './Resources'
import { InfoConfig, InfoUI } from './interface/InfoUI'
import { Experience, ExperienceConstructor } from './Experience'
import { Loader } from './interface/Loader'
import { Raycaster } from './Raycaster'
export class Engine {
  public readonly orthographicCamera!: OrthoCamera
  public readonly perspectiveCamera!: Camera
  public readonly primaryScene!: Scene
  public readonly secondaryScene!: Scene
  public readonly renderEngine!: RenderEngine
  public readonly time!: RenderLoop
  public readonly debug!: DebugUI
  public readonly raycaster!: Raycaster
  public readonly infoUI!: InfoUI
  public readonly sizes!: Sizes
  public readonly canvas!: HTMLCanvasElement
  public readonly resources!: Resources
  public readonly experience!: Experience
  public readonly secondaryExperience!: Experience
  private readonly loader!: Loader

  constructor({
    canvas,
    primaryExperience,
    secondaryExperience,
    info,
  }: {
    canvas: HTMLCanvasElement
    primaryExperience: ExperienceConstructor
    secondaryExperience: ExperienceConstructor
    info?: InfoConfig
  }) {
    if (!canvas) {
      throw new Error('No canvas provided')
    }

    this.canvas = canvas
    this.sizes = new Sizes(this)
    this.debug = new DebugUI()
    this.time = new RenderLoop(this)
    this.primaryScene = new THREE.Scene()
    this.secondaryScene = new THREE.Scene()
    this.orthographicCamera = new OrthoCamera()
    this.perspectiveCamera = new Camera(this)
    this.raycaster = new Raycaster(this)
    this.infoUI = new InfoUI(info)
    this.renderEngine = new RenderEngine(this)
    this.experience = new primaryExperience(this)
    this.secondaryExperience = new secondaryExperience(this)
    this.resources = new Resources([
      ...this.experience.resources,
      ...this.secondaryExperience.resources,
    ])
    this.loader = new Loader()

    this.resources.on('loaded', () => {
      this.experience.init()
      this.secondaryExperience.init()
      this.loader.complete()
    })

    this.resources.on('progress', (progress: number) => {
      this.loader.setProgress(progress)
    })
  }

  update(delta: number) {
    if (!this.loader.isComplete) return

    this.orthographicCamera.update()
    this.perspectiveCamera.update()

    this.renderEngine.update()
    this.experience.update(delta)
    this.secondaryExperience.update(delta)
    this.debug.update()
  }

  resize() {
    this.orthographicCamera.resize()
    this.perspectiveCamera.resize()
    this.renderEngine.resize()
    if (this.experience.resize) {
      this.experience.resize()
    }
    if (this.secondaryExperience.resize) {
      this.secondaryExperience.resize()
    }
  }
}
