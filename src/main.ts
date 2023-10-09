import './style.scss'
import { Engine } from './engine/Engine'
import { MainGameScene } from './scenes/MainGameScene'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: MainGameScene,
  info: {
    title: 'Brain Game',
  },
})
