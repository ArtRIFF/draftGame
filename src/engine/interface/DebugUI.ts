import * as lilGui from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { toogleHelpers } from '../../signals/signals'

let instance: DebugUI | null = null

export class DebugUI {
  private gui!: lilGui.GUI
  private stats!: Stats
  private debugObject = {
    helpers: false,
  }

  constructor(private name: string) {
    if (instance) {
      return this
    }

    instance = this

    this.init()

    if (!window.location.search.includes('debug')) {
      this.gui.hide()
      this.stats.dom.style.display = 'none'
    }

    this.gui.add(this.debugObject, 'helpers').onChange(() => {
      if (this.debugObject.helpers) {
        localStorage.setItem('isHelpersVisible', 'true')
        toogleHelpers.emit('onShowHelpers')
      } else {
        localStorage.setItem('isHelpersVisible', 'false')
        toogleHelpers.emit('onHideHelpers')
      }
    })

    window.addEventListener('keydown', (event) => {
      if (event.key === 'h') {
        if (this.gui._hidden) {
          this.gui.show()
          this.stats.dom.style.display = 'block'
        } else {
          this.gui.hide()
          this.stats.dom.style.display = 'none'
        }
      }
    })
  }

  private init() {
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
    this.gui = new lilGui.GUI()
  }

  update() {
    this.stats.update()
  }
}
