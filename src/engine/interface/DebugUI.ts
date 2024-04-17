import * as lilGui from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module";
import { emitUnitAction, toogleHelpers } from "../../signals/signals";

let instance: DebugUI | null = null;

export class DebugUI
{
	private gui!: lilGui.GUI;
	private stats!: Stats;
	private debugObject = {
		gameHelpers: false,
		cameraRotation: false,
		UIHelpers: false,
	};

	constructor()
	{
		if (instance)
		{
			return this;
		}

		instance = this;

		this.init();

		if (!window.location.search.includes("debug"))
		{
			this.gui.hide();
			this.stats.dom.style.display = "none";
		}

		window.addEventListener("keydown", (event) =>
		{
			if (event.key === "h")
			{
				if (this.gui._hidden)
				{
					this.gui.show();
					this.stats.dom.style.display = "block";
				}
				else
				{
					this.gui.hide();
					this.stats.dom.style.display = "none";
				}
			}
		});
	}

	private init()
	{
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
		this.gui = new lilGui.GUI();
		if (localStorage.getItem("isGameHelpersVisible") === "true")
		{
			this.debugObject.gameHelpers = true;
		}
		if (localStorage.getItem("isEnableCameraRotation") === "true")
		{
			this.debugObject.cameraRotation = true;
		}
		if (localStorage.getItem("isUIHelpersVisible") === "true")
		{
			this.debugObject.UIHelpers = true;
		}
		this.addGameHelpers();
		this.addUIHelpers();
		this.addUnitUI();
	}

	private addGameHelpers()
	{
		this.gui
			.add(
				{
					gameHelpers: this.debugObject.gameHelpers,
				},
				"gameHelpers"
			)
			.onChange(() =>
			{
				this.debugObject.gameHelpers = !this.debugObject.gameHelpers;
				if (this.debugObject.gameHelpers)
				{
					localStorage.setItem("isGameHelpersVisible", "true");
					toogleHelpers.emit("onShowGameHelpers");
				}
				else
				{
					localStorage.setItem("isGameHelpersVisible", "false");
					toogleHelpers.emit("onHideGameHelpers");
				}
			});
		this.gui
			.add(
				{
					cameraRotation: this.debugObject.cameraRotation,
				},
				"cameraRotation"
			)
			.onChange(() =>
			{
				this.debugObject.cameraRotation = !this.debugObject.cameraRotation;
				if (this.debugObject.cameraRotation)
				{
					localStorage.setItem("isEnableCameraRotation", "true");
					toogleHelpers.emit("onSwitchCameraRotation", true);
				}
				else
				{
					localStorage.setItem("isEnableCameraRotation", "false");
					toogleHelpers.emit("onSwitchCameraRotation", false);
				}
			});
	}

	private addUIHelpers(): void
	{
		this.gui
			.add(
				{
					UIHelpers: this.debugObject.UIHelpers,
				},
				"UIHelpers"
			)
			.onChange(() =>
			{
				this.debugObject.UIHelpers = !this.debugObject.UIHelpers;
				if (this.debugObject.UIHelpers)
				{
					localStorage.setItem("isUIHelpersVisible", "true");
					toogleHelpers.emit("onShowUIHelpers");
				}
				else
				{
					localStorage.setItem("isUIHelpersVisible", "false");
					toogleHelpers.emit("onHideUIHelpers");
				}
			});
	}

	private addUnitUI()
	{
		const unitFolder = this.gui.addFolder("Unit");
		unitFolder.add(
			{
				run: () =>
				{
					emitUnitAction.emit("onUnitRun");
				},
			},
			"run"
		);
		unitFolder.add(
			{
				stop: () =>
				{
					emitUnitAction.emit("onUnitStop");
				},
			},
			"stop"
		);
		unitFolder.add(
			{
				hit: () =>
				{
					emitUnitAction.emit("onUnitHit");
				},
			},
			"hit"
		);
		unitFolder.add(
			{
				win: () =>
				{
					emitUnitAction.emit("onUnitWin");
				},
			},
			"win"
		);
		unitFolder.add(
			{
				fall: () =>
				{
					emitUnitAction.emit("onUnitFall");
				},
			},
			"fall"
		);
		unitFolder.add(
			{
				moveLeft: () =>
				{
					emitUnitAction.emit("onUnitMoveLeft");
				},
			},
			"moveLeft"
		);
		unitFolder.add(
			{
				moveRight: () =>
				{
					emitUnitAction.emit("onUnitMoveRight");
				},
			},
			"moveRight"
		);
		unitFolder.close();
	}

	update()
	{
		this.stats.update();
	}
}
