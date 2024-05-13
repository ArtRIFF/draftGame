import { Experience } from '../engine/Experience';
import { Engine } from '../engine/Engine';
import * as THREE from 'three';
import { Resource } from '../engine/Resources';
import { Object3D } from 'three';
import { emitUnitAction, toogleHelpers } from '../signals/signals';
import { UnitControl } from '../controls/UnitControl';
import { ModelControl } from '../controls/ModelControl';
import { SwipeManager } from '../managers/SwipeManager';
import { MovingTrackManager } from '../managers/MovingTrackManager';
import { CollisionManager } from '../managers/CollisionManager';

export class MainGameScene implements Experience {
  resources: Resource[] = [
    {
      name: 'BrainMan',
      type: 'gltf',
      path: '../../assets/BrainMan.glb',
    },
    {
      name: 'Brain',
      type: 'gltf',
      path: '../../assets/Brain.glb',
    },
    {
      name: 'TrackFloor',
      type: 'gltf',
      path: '../../assets/TrackFloor.glb',
    },
    {
      name: 'Obstacle',
      type: 'gltf',
      path: '../../assets/Obstacle.glb',
    },
  ];
  private gridHelper: Object3D = new THREE.GridHelper(100, 50);
  private directLightHelper!: Object3D;
  private hemisphereLightHelper!: Object3D;
  private pointLightHelper!: Object3D;
  private axes: Object3D = new THREE.AxesHelper(100);
  private unit!: UnitControl;
  private trackFloor!: ModelControl;
  private swipeManager: SwipeManager = new SwipeManager();
  private movingTrackManager: MovingTrackManager;
  private collisionManager: CollisionManager = new CollisionManager();
  private isCollision: boolean = false;

  constructor(private engine: Engine) {
    this.movingTrackManager = new MovingTrackManager(this.engine);
    toogleHelpers.on('onShowGameHelpers', () => this.showHelpers());
    toogleHelpers.on('onHideGameHelpers', () => this.hideHelpers());
    toogleHelpers.on('onSwitchCameraRotation', (switchValue: boolean) =>
      this.onSwitchRotationCamera(switchValue)
    );
    emitUnitAction.on('onUnitRun', () => this.unit.run());
    emitUnitAction.on('onUnitStop', () => this.unit.stop());
    emitUnitAction.on('onUnitHit', () => this.unit.hit());
    emitUnitAction.on('onUnitWin', () => this.unit.win());
    emitUnitAction.on('onUnitFall', () => this.unit.fall());
    emitUnitAction.on('onUnitMoveLeft', () => this.unit.moveLeft());
    emitUnitAction.on('onUnitMoveRight', () => this.unit.moveRight());
  }

  init() {
    this.setCamera();
    this.setBackground();
    this.addTrackFloor();
    this.addUnit();
    const startPointZ = Math.floor(
      this.trackFloor.z - this.trackFloor.objectSize.deep
    );
    const trackLength = Math.floor(this.trackFloor.objectSize.deep);
    this.movingTrackManager.setTrackParameters(startPointZ, trackLength);
    this.movingTrackManager.addTrackObjects();
    this.setLight();
    this.hideHelpers();
    if (localStorage.getItem('isGameHelpersVisible') === 'true') {
      this.showHelpers();
    }
    if (localStorage.getItem('isEnableCameraRotation') === 'true') {
      this.engine.perspectiveCamera.enableOrbitRotation = true;
    }
    this.collisionManager.addObjects(
      this.unit,
      this.movingTrackManager.getTrackObjectArray()
    );
    this.collisionManager.onCollision(() => {
      if (!this.isCollision) {
        this.movingTrackManager.stopMoveTrack();
        this.unit.fall();
        this.isCollision = !this.isCollision;
        console.log('Collision');
      }
    });
  }

  resize() {}

  private setCamera() {
    this.engine.perspectiveCamera.enableOrbitRotation = false;
    this.engine.perspectiveCamera.instance.position.set(0, 10, 30);
  }

  private onSwitchRotationCamera(switchValue: boolean) {
    this.engine.perspectiveCamera.enableOrbitRotation = switchValue;
  }

  private setLight() {
    this.engine.primaryScene.add(new THREE.AmbientLight(0xffffff, 0.1));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 30, -40);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 3072;
    directionalLight.shadow.mapSize.height = 3072;
    directionalLight.shadow.camera.near = 1.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -80;
    directionalLight.shadow.camera.right = 80;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    hemisphereLight.position.set(0, 10, 0);
    const pointLight = new THREE.PointLight(0xe6e229, 10, 0);
    pointLight.position.set(0, 6, 19.5);

    this.hemisphereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      2
    );
    this.directLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    this.pointLightHelper = new THREE.PointLightHelper(pointLight);

    this.engine.primaryScene.add(directionalLight, hemisphereLight, pointLight);

    this.engine.primaryScene.add(
      this.hemisphereLightHelper,
      this.directLightHelper,
      this.pointLightHelper,
      this.gridHelper
    );
  }

  hideHelpers() {
    this.axes.visible = false;
    this.gridHelper.visible = false;
    this.directLightHelper.visible = false;
    this.hemisphereLightHelper.visible = false;
    this.pointLightHelper.visible = false;
  }

  showHelpers() {
    this.axes.visible = true;
    this.gridHelper.visible = true;
    this.directLightHelper.visible = true;
    this.hemisphereLightHelper.visible = true;
    this.pointLightHelper.visible = true;
  }

  update(delta: number) {
    this.unit.update(delta);
    this.collisionManager.update();
    this.updateCamera();
  }

  updateCamera() {}

  private setBackground() {
    this.engine.primaryScene.background = new THREE.Color(0xa0a0a0);
    this.engine.primaryScene.fog = new THREE.Fog(0xa0a0a0, 20, 70);
  }

  private addTrackFloor() {
    const trackFloorModel = this.engine.resources.getItem('TrackFloor');
    this.trackFloor = new ModelControl(trackFloorModel);
    this.trackFloor.addToScene(this.engine.primaryScene);
    this.trackFloor.setPosition(0, 0, 30);
    this.trackFloor.setScale(1, 1, 3);
  }

  private addUnit() {
    const brainManModel = this.engine.resources.getItem('BrainMan');
    this.unit = new UnitControl(brainManModel);
    this.unit.setPosition(0, 0.1, 20);
    this.unit.setRotation(0, Math.PI, 0);
    this.unit.addToScene(this.engine.primaryScene);
    this.unit.step = +this.trackFloor.objectSize.width.toFixed(0) / 3;
    this.swipeManager.subscribeOnLeftSwipe(() => {
      this.unit.moveLeft().then(() => {
        this.unit.run();
      });
    });
    this.swipeManager.subscribeOnRightSwipe(() => {
      this.unit.moveRight().then(() => {
        this.unit.run();
      });
    });
    this.swipeManager.subscribeOnTopSwipe(() => {
      this.unit.run().then(() => {
        this.movingTrackManager.stopMoveTrack();
      });

      this.movingTrackManager.startMoveTrack(7, 2).then(() => {
        this.movingTrackManager.startMoveTrack(4, 2);
      });

      this.isCollision = false;
    });
    this.swipeManager.subscribeOnBottomSwipe(() => {
      this.unit.stop();
    });
  }
}
