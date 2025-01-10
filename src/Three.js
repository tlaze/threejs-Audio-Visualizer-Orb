import * as THREE from 'three';
import { useEffect, useRef } from "react";
// import background from './background.png'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.133.0/examples/jsm/controls/OrbitControls.js';

function Three() {
  
  const refContainer = useRef(null);
  
  useEffect(() => {
    // Scene
    var scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff)


    // // Glass Sphere background scene
    // const textureLoader = new THREE.CubeTextureLoader()
    // const texture = textureLoader.load([
    //     'https://threejs.org/examples/textures/cube/Park2/posx.jpg',
    //     'https://threejs.org/examples/textures/cube/Park2/negx.jpg',
    //     'https://threejs.org/examples/textures/cube/Park2/posy.jpg',
    //     'https://threejs.org/examples/textures/cube/Park2/negy.jpg',
    //     'https://threejs.org/examples/textures/cube/Park2/posz.jpg',
    //     'https://threejs.org/examples/textures/cube/Park2/negz.jpg'
    // ])
    // scene.background = texture
    // scene.environment = texture


    // Camera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;


    // Object (Sphere)
    var geometry = new THREE.SphereGeometry(50,64,64);
    var material = new THREE.MeshPhysicalMaterial({
        color: '0x88ccff',
        metalness: 0.0,
        roughness: 0.0,
        transmission: .6, // Add transparency
        opacity: 0.9,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 3.0,
    });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true
    scene.add(sphere);

    // Lights

        // Add lights to the scene
        const light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(50, 50, 50);
        scene.add(light);


        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
        scene.add(ambientLight);


    // const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    // ambientLight.castShadow = true
    // scene.add(ambientLight)

    // var directionalLight = new THREE.DirectionalLight(0xffffff,0.8)
    // directionalLight.position.z = 50;
    // directionalLight.position.x = 1;
    // directionalLight.position.y = 1;
    // directionalLight.castShadow = true
    // scene.add(directionalLight)

    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    // scene.add(dLightHelper)

    
    // Renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2)
    renderer.shadowMap.enambled = true
    refContainer.current && refContainer.current.appendChild( renderer.domElement );
    window.addEventListener('resize', ()=>{
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })

        // Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smoothly damping effect during rotation
controls.dampingFactor = 0.05;


    // Animation
    var animate = function () {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.1;
      sphere.rotation.y += 0.1;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div ref={refContainer}></div>
  );
}

export default Three