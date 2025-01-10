import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { GUI } from 'lil-gui';

function Orb(){

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const orbit = new OrbitControls(camera, renderer.domElement);
    
    camera.position.set(6, 8, 14);
    orbit.update();
    
    // Edit Color and Bloom of Orb
    const params = {
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        threshold: 0.5,
        strength: 0.4,
        radius: 0.8,
    };
    const uniforms = {
        u_time: { value: 0.0 },
        u_frequency: { value: 0.0 },
        u_red: { value: params.red },
        u_green: { value: params.green },
        u_blue: { value: params.blue },
      };

    const gui = new GUI();

    const colorsFolder = gui.addFolder('Colors');
    colorsFolder.add(params, 'red', 0, 1).onChange(function (value) {
    uniforms.u_red.value = Number(value);
    });
    colorsFolder.add(params, 'green', 0, 1).onChange(function (value) {
    uniforms.u_green.value = Number(value);
    });
    colorsFolder.add(params, 'blue', 0, 1).onChange(function (value) {
    uniforms.u_blue.value = Number(value);
    });

    const bloomFolder = gui.addFolder('Bloom');
    bloomFolder.add(params, 'threshold', 0, 1).onChange(function (value) {
    bloomPass.threshold = Number(value);
    });
    bloomFolder.add(params, 'strength', 0, 3).onChange(function (value) {
    bloomPass.strength = Number(value);
    });
    bloomFolder.add(params, 'radius', 0, 1).onChange(function (value) {
    bloomPass.radius = Number(value);
    });

    const mat = new THREE.ShaderMaterial({
      wireframe: true,
      uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
    });
    
    // Create orb
    const geo = new THREE.IcosahedronGeometry(4, 30);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(animate);
    
    // Audio event listener
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const analyser = new THREE.AudioAnalyser(sound, 32);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('audio-sample.mp3', function (buffer) {
        sound.setBuffer(buffer);
        window.addEventListener('click', function () {
            sound.play();
        });
    });

    // Post Processing - orb glow
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight)
    );

    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    const bloomComposer = new EffectComposer(renderer);

    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
    bloomComposer.addPass(outputPass);

    function animate() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = analyser.getAverageFrequency();
        bloomComposer.render();
        requestAnimationFrame(animate);
      }
    animate();
    
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
    });
}
export default Orb