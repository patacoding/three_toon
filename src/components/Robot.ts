import {
    MeshToonMaterial,
    Scene,
    Color,
    AnimationMixer,
    Object3D,
    TextureLoader,
} from 'three';
import { MyGltfLoader, InitAnimation } from './Loader.ts';

export class Robot {
    model: any;
    resourceUrl: string;
    scene: Scene;
    isReady: boolean;
    mixer: AnimationMixer;
    animationsMap: Map<string, any>;
    constructor(resourceUrl: string, scene: Scene) {
        this.model = null;
        this.resourceUrl = resourceUrl;
        this.scene = scene;
        this.isReady = false;
        this.mixer = new AnimationMixer(Object3D);
        this.animationsMap = new Map();
    }

    async init() {
        try {
            const gltf = await MyGltfLoader(this.resourceUrl);
            console.log('gltf', gltf.animations);
            const model = gltf.scene;
            model.scale.set(0.2, 0.2, 0.2);

            model.position.set(0, 0, 0);
            // set material to model
            // const material = new MeshBasicMaterial({
            //     color: 0x00ff00,
            //     wireframe: false,
            // });
            const tm = new MeshToonMaterial({
                // color: 0x000000,
                // alphaTest: 0.0,
                // transparent: true,
                // opacity: 0,
            });
            let color_map = {
                body: new Color(0xfce3d9),
                HatAndShoues: new Color(0xfbd73a),
                hairA: new Color(0x4e4e4e),
                hairB: new Color(0x4e4e4e),
                // cloth: new Color(0x3b3e60),
                head: new Color(0xf6dfd9),
            };
            let tex_map = {
                body: 'models/luoli_tex/body.png',
                HatAndShoues: 'models/luoli_tex/HatAndShoues.png',
                hairA: 'models/luoli_tex/hairA.png',
                hairB: 'models/luoli_tex/hairB.png',
                cloth: 'models/luoli_tex/cloth.png',
                head: 'models/luoli_tex/head.png',
            };

            model.traverse((o: any) => {
                if (o.isMesh) {
                    // o.material = toonMat;
                    // console.log('o material', o.material.name);
                    if (o.material.name in color_map) {
                        console.log(
                            'set mat for name:',
                            o.material.name,
                            color_map[o.material.name]
                        );
                        const toonM = tm.clone();
                        toonM.color = color_map[o.material.name];

                        if (o.material.name in tex_map) {
                            const tex = new TextureLoader().load(
                                tex_map[o.material.name]
                            );
                            toonM.map = tex;
                        }
                        if (o.material.name == 'head') {
                            return;
                        }
                        o.material = toonM;
                    } else {
                        console.log('no set mat for name:', o.material.name);
                    }
                    // o.material.metalness = 0;
                    o.castShadow = true;
                    // TODO receive shadow will dark the model ugly
                    // o.receiveShadow = true;
                }
            });
            this.model = model;
            this.scene.add(model);

            [this.mixer, this.animationsMap] = InitAnimation(gltf);
            console.log('this.mixer', this.mixer);
            console.log('this.animationsMap', this.animationsMap);
            this.animationsMap.forEach((value, _key) => {
                value.play();
            });

            this.isReady = true;
        } catch (error) {
            console.log('hero gltf', error);
        }
    }

    update(delta: number) {
        if (this.mixer) {
            // console.log('update robot', this.mixer, delta);
            this.mixer.update(delta / 10);
        }
    }
}
