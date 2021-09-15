import * as THREE from 'three';
import * as dat from 'dat.gui';
import {Boid} from "@/js/boids";

export default {
    element: null,

    scene: null,
    camera: null,
    renderer: null,

    objects: [],

    lastLoopTime: 16,
    lastFrameStart: performance.now(),

    gui: new dat.GUI({name: 'Background'}),

    setup(element){
        this.element = element

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.antialias = true
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.element.appendChild( this.renderer.domElement );

        this.scene.background = new THREE.Color( 0xfcfcfc );

        this.camera.position.setZ(10)

        const material = new THREE.MeshNormalMaterial( {side: THREE.DoubleSide} );
        const geometry = new THREE.IcosahedronGeometry(0.1)


        for(let i = 0 ; i < 500 ; i++){
            let mesh = new THREE.Mesh( geometry, material );
            mesh.userData.boid = new Boid();
            this.objects.push(mesh)
            this.scene.add(mesh)
        }


        // dat.gui debug stuff
        this.gui.hide()
        document.debug = this.gui

        let boidsFolder = this.gui.addFolder('Boids');
        let boidsControlsFolder = boidsFolder.addFolder('Controls');
        let boidsParametersFolder = boidsFolder.addFolder('Parameters');
        boidsControlsFolder.add({ reset:function(){ Boid.boids.forEach((b) => b.reset()) }}, 'reset');
        boidsControlsFolder.add({ pullIn:function(){ Boid.boids.forEach((b) => b.direction.addScaledVector(b.position, -2)) }}, 'pullIn');
        boidsParametersFolder.add(Boid, 'visualRange', 0, 10);
        boidsParametersFolder.add(Boid, 'minDistance', 0, 5);
        boidsParametersFolder.add(Boid, 'centeringFactor', 0, 1);
        boidsParametersFolder.add(Boid, 'avoidFactor', 0, 1);
        boidsParametersFolder.add(Boid, 'alignFactor', 0, 1);
        boidsParametersFolder.add(Boid, 'boundTurnFactor', 0, 1);
        boidsParametersFolder.add(Boid, 'speedLimit', 0, 2);
    },

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    },

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        this.lastLoopTime = performance.now() - this.lastFrameStart;
        this.lastFrameStart = performance.now()

        this.camera.position.setY((-window.pageYOffset / window.innerHeight) * 10)
        this.camera.position.setZ(10 - (window.pageYOffset / window.innerHeight) * 20)

        if(window.pageYOffset < window.innerHeight){
            for(let obj of this.objects){
                obj.userData.boid.update(this.lastLoopTime > 100 ? 16 : this.lastLoopTime)

                obj.position.set(
                    obj.userData.boid.position.x,
                    obj.userData.boid.position.y,
                    obj.userData.boid.position.z
                )
            }

            this.renderer.render( this.scene, this.camera );
        }
    }
}

