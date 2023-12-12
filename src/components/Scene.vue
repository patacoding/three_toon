<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Robot } from './Robot.ts';

const sceneDiv = ref<HTMLCanvasElement>();
let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    robot: Robot,
    dirLight: THREE.DirectionalLight;

const clock = new THREE.Clock();
const loop = () => {
    requestAnimationFrame(loop);
    if (robot.isReady) {
        dirLight.target = robot.model;
        dirLight.target.updateMatrixWorld();
        robot.update(clock.getDelta());
    }
    renderer.render(scene, camera);
};
onMounted(() => {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    sceneDiv.value?.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        500
    );
    camera.position.set(0, 20, 100);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 4;
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 200, 200);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = window.innerWidth * window.devicePixelRatio;
    dirLight.shadow.mapSize.height =
        window.innerHeight * window.devicePixelRatio;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.near = 10; // default
    dirLight.shadow.camera.far = 500; // default

    scene.add(dirLight);

    // add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // add ground plane
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 1,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.receiveShadow = true;
    scene.add(plane);

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    // scene.add(mesh);

    let gltfUrl = 'models/Soldier.glb';
    // gltfUrl = 'models/mech_drone.glb';
    gltfUrl = 'models/luoli_run.glb';
    // gltfUrl = 'models/luoli_cube.glb';

    robot = new Robot(gltfUrl, scene);
    robot.init();

    loop();
});
console.log('scene');
</script>
<template>
    <div id="scene" ref="sceneDiv"></div>
</template>

<style scoped>
#scene {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
