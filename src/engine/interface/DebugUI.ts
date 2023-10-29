import * as lilGui from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { emitUnitAction, toogleHelpers } from '../../signals/signals'

let instance: DebugUI | null = null

export class DebugUI {
  private gui!: lilGui.GUI
  private stats!: Stats
  private debugObject = {
    helpers: false,
  }

  constructor() {
    if (instance) {
      return this
    }

    instance = this

    this.init()

    if (!window.location.search.includes('debug')) {
      this.gui.hide()
      this.stats.dom.style.display = 'none'
    }

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
    if (localStorage.getItem('isHelpersVisible') === 'true') {
      this.debugObject.helpers = true
    }
    this.addHelpersUI()
    this.addUnitUI()
  }

  private addHelpersUI() {
    this.gui.add(this.debugObject, 'helpers').onChange(() => {
      if (this.debugObject.helpers) {
        localStorage.setItem('isHelpersVisible', 'true')
        this.debugObject.helpers = true
        toogleHelpers.emit('onShowHelpers')
      } else {
        localStorage.setItem('isHelpersVisible', 'false')
        this.debugObject.helpers = false
        toogleHelpers.emit('onHideHelpers')
      }
    })
  }

  private addUnitUI() {
    const unitFolder = this.gui.addFolder('Unit')
    unitFolder.add(
      {
        run: () => {
          emitUnitAction.emit('onUnitRun')
        },
      },
      'run'
    )
    unitFolder.add(
      {
        stop: () => {
          emitUnitAction.emit('onUnitStop')
        },
      },
      'stop'
    )
    unitFolder.add(
      {
        hit: () => {
          emitUnitAction.emit('onUnitHit')
        },
      },
      'hit'
    )
    unitFolder.add(
      {
        win: () => {
          emitUnitAction.emit('onUnitWin')
        },
      },
      'win'
    )
    unitFolder.add(
      {
        fall: () => {
          emitUnitAction.emit('onUnitFall')
        },
      },
      'fall'
    )
    unitFolder.add(
      {
        moveLeft: () => {
          emitUnitAction.emit('onUnitMoveLeft')
        },
      },
      'moveLeft'
    )
    unitFolder.add(
      {
        moveRight: () => {
          emitUnitAction.emit('onUnitMoveRight')
        },
      },
      'moveRight'
    )
    unitFolder.close()
  }

  update() {
    this.stats.update()
  }
}
