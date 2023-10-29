import * as THREE from 'three'
import vertexShader from '../demo/shader.vert'
import fragmentShader from '../demo/shader.frag'

export class Obstacle extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.BoxGeometry(4, 2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
    })

    super(geometry, material)
  }
}
