import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js'
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

        this.renderer = new THREE.WebGLRenderer(  { alpha: true } );
        this.renderer.antialias = true
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.element.appendChild( this.renderer.domElement );

        this.camera.position.setZ(10)

        this.material = new THREE.MeshNormalMaterial( {side: THREE.DoubleSide} );
        this.geometry = new THREE.IcosahedronGeometry(0.1)

        this.spawnBoids(500)


        // debug stuff

        this.gui = new dat.GUI({name: 'Background'})
        this.stats = new Stats()

        this.gui.hide()
        document.debug = this.gui

        let debugData = { showStats: false, spawnAmount: 500 }

        let statsFolder = this.gui.addFolder('Stats');
        statsFolder.add({ toggleStats:() => {
            if(debugData.showStats){
                this.stats.dom.remove()
            }else{
                document.body.appendChild( this.stats.dom );
            }
            debugData.showStats = !debugData.showStats
        }}, 'toggleStats');


        let cameraFolder = this.gui.addFolder('Camera');
        cameraFolder.add(this.camera, 'fov', 10, 180, 5).onChange(() => {this.camera.updateProjectionMatrix();});


        let boidsFolder = this.gui.addFolder('Boids');
        let boidsControlsFolder = boidsFolder.addFolder('Controls');
        let boidsSpawnFolder = boidsFolder.addFolder('Spawner');
        let boidsBoundaryFolder = boidsFolder.addFolder('Boundary');
        let boidsParametersFolder = boidsFolder.addFolder('Parameters');
        boidsControlsFolder.add({ reset:function(){ Boid.boids.forEach((b) => b.reset()) }}, 'reset');
        boidsControlsFolder.add({ nullForce:function(){ Boid.boids.forEach((b) => b.direction = new THREE.Vector3()) }}, 'nullForce');
        boidsControlsFolder.add({ pullIn:function(){ Boid.boids.forEach((b) => b.direction.addScaledVector(b.position, -2)) }}, 'pullIn');
        boidsControlsFolder.add({ pushOut:function(){ Boid.boids.forEach((b) => b.direction.addScaledVector(b.position, 2)) }}, 'pushOut');
        boidsSpawnFolder.add(debugData, 'spawnAmount', 0, 2000, 10);
        boidsSpawnFolder.add({ spawn:() => { this.spawnBoids(debugData.spawnAmount) }}, 'spawn');
        boidsBoundaryFolder.add(Boid, 'boundaryX', 0, 20, 1).listen();
        boidsBoundaryFolder.add(Boid, 'boundaryY', 0, 20, 1).listen();
        boidsBoundaryFolder.add(Boid, 'boundaryZ', 0, 20, 1).listen();
        boidsParametersFolder.add(Boid, 'visualRange', 0, 10).listen();
        boidsParametersFolder.add(Boid, 'minDistance', 0, 5).listen();
        boidsParametersFolder.add(Boid, 'centeringFactor', 0, 1).listen();
        boidsParametersFolder.add(Boid, 'avoidFactor', 0, 1).listen();
        boidsParametersFolder.add(Boid, 'alignFactor', 0, 1).listen();
        boidsParametersFolder.add(Boid, 'boundTurnFactor', 0, 1).listen();
        boidsParametersFolder.add(Boid, 'speedLimit', 0, 1).listen();
        boidsParametersFolder.add({ defaultValues:function(){
            Boid.visualRange = 2;
            Boid.minDistance = 0.6;
            Boid.centeringFactor = 0.008;
            Boid.avoidFactor = 0.005;
            Boid.alignFactor = 0.02;
            Boid.boundTurnFactor = 0.01;
            Boid.speedLimit = 0.1;
        }}, 'defaultValues');
    },

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    },

    spawnBoids(amount) {
        this.objects.forEach((obj) => this.scene.remove(obj))

        this.objects = [];
        Boid.boids = [];

        for(let i = 0 ; i < amount ; i++){
            let mesh = new THREE.Mesh( this.geometry, this.material );
            mesh.userData.boid = new Boid();
            this.objects.push(mesh)
            this.scene.add(mesh)
        }
    },

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        this.lastLoopTime = performance.now() - this.lastFrameStart;
        this.lastFrameStart = performance.now()
        this.stats.begin()

        this.camera.position.setY((-window.pageYOffset / window.innerHeight) * 5)

        if(window.pageYOffset < window.innerHeight * 10){
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

        this.stats.end()
    }
}

