import * as THREE from 'three';
//import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";

export default {
    element: null,

    scene: null,
    camera: null,
    renderer: null,

    testCube: null,

    setup(element){
        this.element = element

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.antialias = true
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.element.appendChild( this.renderer.domElement );

        this.scene.background = new THREE.Color( 0xfcfcfc );

        this.camera.position.setZ(5)

        const geometry = new THREE.TorusKnotGeometry( 10, 3, 500, 100 );
        const material = new THREE.MeshNormalMaterial( {color: 0x00ff00, side: THREE.DoubleSide} );
        this.testCube = new THREE.Mesh( geometry, material );
        this.testCube.scale.set(0.2, 0.2, 0.2)
        this.scene.add(this.testCube)

        let light = new THREE.PointLight( new THREE.Color("hsl(0, 0%, 70%)"), 1, 100 );
        light.position.setZ(5)
        this.scene.add(light)

        let alight = new THREE.AmbientLight( new THREE.Color("hsl(0, 0%, 70%)"));
        this.scene.add(alight)
    },

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        this.testCube.rotation.x = window.scrollY / 1000;
        this.testCube.rotation.y = window.scrollY / 1000;
        this.testCube.rotation.z = window.scrollY / 1000;

        this.renderer.render( this.scene, this.camera );
    }
}

