import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { LoadingManager, AnimationMixer } from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

const manager = new LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(
        'Started loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
    );
};

manager.onLoad = function () {
    console.log('Loading complete!');
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(
        'Loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
    );
};

manager.onError = function (url: string) {
    console.log('There was an error loading ' + url);
};

const gltfLoader = new GLTFLoader(manager);

export function MyGltfLoader(url: string) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            url,
            (gltf: any) => {
                resolve(gltf);
            },
            (xhr: any) => {
                // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                return xhr.loaded / xhr.total;
            },
            (error: any) => {
                reject(error);
                // return error;
            }
        );
    });
}

export function InitAnimation(gltf: GLTF) {
    const model = gltf.scene;
    const gltfAnimations = gltf.animations;
    const mixer = new AnimationMixer(model);
    const animationsMap = new Map();
    console.log('gltfAnimations', gltfAnimations);

    for (let i = 0; i < gltfAnimations.length; i++) {
        // console.log('npm action name', gltfAnimations[i].name);
        const animation = gltfAnimations[i];
        const action = mixer.clipAction(animation);
        animationsMap.set(animation.name, action);
    }

    return [mixer, animationsMap];
}
