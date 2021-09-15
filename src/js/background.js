import * as THREE from 'three';
//import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries";
import {Boid} from "@/js/boids";

export default {
    element: null,

    scene: null,
    camera: null,
    renderer: null,

    objects: [],

    lastLoopTime: 16,
    lastFrameStart: performance.now(),

    setup(element){
        this.element = element

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.antialias = true
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.element.appendChild( this.renderer.domElement );

        this.scene.background = new THREE.Color( 0xfcfcfc );
        this.scene.fog = new THREE.FogExp2(0xfcfcfc, 0.12);

        this.camera.position.setZ(10)

        const material = new THREE.MeshNormalMaterial( {color: 0xfcfcfc, side: THREE.DoubleSide} );
        //const geometry = new THREE.ConeGeometry( 0.1, 0.2, 32 );
        const geometry = new THREE.IcosahedronGeometry(0.1)


        for(let i = 0 ; i < 500 ; i++){
            let mesh = new THREE.Mesh( geometry, material );
            mesh.userData.boid = new Boid();
            this.objects.push(mesh)
            this.scene.add(mesh)
        }

        let alight = new THREE.AmbientLight( new THREE.Color("hsl(0, 0%, 70%)"));
        this.scene.add(alight)
    },

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        this.lastLoopTime = performance.now() - this.lastFrameStart;
        this.lastFrameStart = performance.now()

        for(let obj of this.objects){
            obj.userData.boid.update(this.lastLoopTime)

            obj.position.set(
                obj.userData.boid.position.x,
                obj.userData.boid.position.y,
                obj.userData.boid.position.z
            )
        }

        this.renderer.render( this.scene, this.camera );
    }
}

