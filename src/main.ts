import './style.scss'
import { Engine } from './engine/Engine'
import { GameUserPanelScene } from './scenes/GameUserPanelScene'
import { MainGameScene } from './scenes/MainGameScene'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  primaryExperience: MainGameScene,
  secondaryExperience: GameUserPanelScene,
  info: {
    title: 'Brain Game',
  },
})
