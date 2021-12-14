import * as THREE from 'three';
import * as dat from 'dat.gui';
import Stats from 'stats.js'
import {Boid} from "@/js/multi-group-boids";
import {Vector3} from "three";

export default {
    element: null,

    scene: null,
    camera: null,
    renderer: null,

    objects: [],

    lastLoopTime: 16,
    lastFrameStart: performance.now(),
    lastSimulationTime: 0,

    predictedMaxBoids: 0,

    stats: new Stats(),

    disposed: false,

    setup(element){
        this.element = element

        this.disposed = false

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

        this.renderer = new THREE.WebGLRenderer(  { alpha: true } );
        this.renderer.antialias = true
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.element.appendChild( this.renderer.domElement );

        this.camera.position.setZ(10)

        this.material = new THREE.MeshMatcapMaterial( {side: THREE.DoubleSide} );
        this.geometry = new THREE.IcosahedronGeometry(0.1)

        new THREE.TextureLoader().load(
            '/assets/matcaps/basic_dark_orange.png',
            (texture) => {
                this.material = new THREE.MeshMatcapMaterial( {side: THREE.DoubleSide, matcap: texture} );
            }
        );

        // debug stuff

        this.gui = new dat.GUI({name: 'Background'})

        this.gui.hide()
        document.debug = this.gui

        let debugData = {
            showStats: false,
            spawnAmount: 500,
            benchmark: {
                steps: 100,
                maxAmount: 1000,
                threshold: 13
            }
        }

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
        let boidsBenchmarkFolder = boidsFolder.addFolder('Benchmark');
        let boidsSpawnFolder = boidsFolder.addFolder('Spawner');
        let boidsBoundaryFolder = boidsFolder.addFolder('Boundary');
        let boidsParametersFolder = boidsFolder.addFolder('Parameters');

        boidsControlsFolder.add({ reset:function(){ Boid.boids.forEach((b) => b.reset()) }}, 'reset');
        boidsControlsFolder.add({ nullForce:function(){ Boid.boids.forEach((b) => b.direction = new THREE.Vector3()) }}, 'nullForce');
        boidsControlsFolder.add({ pullIn:function(){ Boid.boids.forEach((b) => b.direction.addScaledVector(b.position, -2)) }}, 'pullIn');
        boidsControlsFolder.add({ pushOut:function(){ Boid.boids.forEach((b) => b.direction.addScaledVector(b.position, 2)) }}, 'pushOut');

        boidsBenchmarkFolder.add(debugData.benchmark, 'steps', 5, 1000, 5);
        boidsBenchmarkFolder.add(debugData.benchmark, 'maxAmount', 100, 5000, 100);
        boidsBenchmarkFolder.add(debugData.benchmark, 'threshold', 1, 200, 1);
        boidsBenchmarkFolder.add({ benchmark:() => { this.benchmark(debugData.benchmark.steps, debugData.benchmark.maxAmount, debugData.benchmark.threshold) }}, 'benchmark');

        boidsSpawnFolder.add(debugData, 'spawnAmount', 0, 2000, 10);
        boidsSpawnFolder.add({ spawn:() => { this.spawnBoids(debugData.spawnAmount) }}, 'spawn');

        boidsBoundaryFolder.add(Boid, 'boundaryX', 0, 20, 1).listen();
        boidsBoundaryFolder.add(Boid, 'boundaryY', 0, 20, 1).listen();
        boidsBoundaryFolder.add(Boid, 'boundaryZ', 0, 20, 1).listen();

        boidsParametersFolder.add(Boid, 'visualRange', 0, 10).listen();
        boidsParametersFolder.add(Boid, 'minDistance', 0, 5).listen();
        boidsParametersFolder.add(Boid, 'centeringFactor', 0, 0.1).listen();
        boidsParametersFolder.add(Boid, 'avoidFactor', 0, 0.1).listen();
        boidsParametersFolder.add(Boid, 'alignFactor', 0, 0.1).listen();
        boidsParametersFolder.add(Boid, 'boundTurnFactor', 0, 0.1).listen();
        boidsParametersFolder.add(Boid, 'groupVisualRange', 0, 10).listen();
        boidsParametersFolder.add(Boid, 'groupAvoidFactor', 0, 0.1).listen();
        boidsParametersFolder.add(Boid, 'groupAmount', 1, 5).listen();
        boidsParametersFolder.add(Boid, 'speedLimit', 0, 1).listen();

        boidsParametersFolder.add({ defaultValues:function(){
            Boid.visualRange = 2.4;
            Boid.minDistance = 0.6;
            Boid.centeringFactor = 0.008;
            Boid.avoidFactor = 0.004;
            Boid.alignFactor = 0.02;
            Boid.boundTurnFactor = 0.1;
            Boid.speedLimit = 0.1;
            Boid.groupAmount = 3;
            Boid.groupVisualRange = 4;
            Boid.groupAvoidFactor = 0.002;
        }}, 'defaultValues');
    },

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    },

    benchmark(steps = 100, maxAmount = 1000, threshold = 13, stepTime = 100, waitTime = 300) {
        let oldBoundary = {
            x: Boid.boundaryX,
            y: Boid.boundaryY,
            z: Boid.boundaryZ
        }

        // make them stay in the center
        Boid.boundaryX = 0.1;
        Boid.boundaryY = 0.1;
        Boid.boundaryZ = 0.1;

        let i = 1;
        let log = []

        return new Promise((resolve) => {

            let testAmount = (i) => {
                if(i * steps < maxAmount){
                    // spawn boids
                    this.spawnBoids(i * steps)
                    // set boids position to center
                    Boid.boids.forEach((b) => b.position = new Vector3())
                    // wait
                    setTimeout(() => {
                        log.push({simulationTime: this.lastSimulationTime, amount: i * steps})

                        // if simulation took to long return current amount
                        if(this.lastSimulationTime > threshold){
                            returnResult((i - 1) * steps)
                            return
                        }
                        // spawn new amount
                        i++
                        testAmount(i)
                    }, stepTime)
                }else {
                    returnResult((i - 1) * steps)
                    return
                }
            }

            let returnResult = (amount) => {
                // reset boundarys
                Boid.boundaryX = oldBoundary.x;
                Boid.boundaryY = oldBoundary.y;
                Boid.boundaryZ = oldBoundary.z;

                this.spawnBoids(amount)

                console.log("%cBenchmark Result", "color:white; font-size:24px" );
                console.table(log)

                // return max amount
                resolve(amount)
            }


            // clear
            if(this.object !== null)this.objects.forEach((obj) => this.scene.remove(obj))

            this.objects = [];
            Boid.boids = [];

            // start benchmark
            setTimeout(() => {
                testAmount(i)
            }, waitTime)

        });
    },

    spawnBoids(amount) {
        if(this.object !== null)this.objects.forEach((obj) => this.scene.remove(obj))

        this.objects = [];
        Boid.boids = [];

        for(let i = 0 ; i < amount ; i++){
            let mesh = new THREE.Mesh( this.geometry, this.material );
            mesh.userData.boid = new Boid();
            this.objects.push(mesh)
            this.scene.add(mesh)
        }
    },

    dispose() {
        this.disposed = true

        Boid.boids = []
        this.objects = []

        this.element.removeChild(this.renderer.domElement)
        this.material.dispose()
        this.geometry.dispose()

        this.gui.destroy()
    },

    render(){
        if(!this.disposed) {
            requestAnimationFrame(() => {
                this.render();
            });

            this.lastLoopTime = performance.now() - this.lastFrameStart;
            this.lastFrameStart = performance.now()
            this.stats.begin()

            this.camera.position.setY((-window.pageYOffset / window.innerHeight) * 10)
            this.camera.position.setZ(10 - (window.pageYOffset / window.innerHeight) * 20)

            if (window.pageYOffset < window.innerHeight) {
                let start = performance.now()

                for (let obj of this.objects) {
                    obj.userData.boid.update(this.lastLoopTime > 100 ? 16 : this.lastLoopTime)

                    obj.position.set(
                        obj.userData.boid.position.x,
                        obj.userData.boid.position.y,
                        obj.userData.boid.position.z
                    )
                }

                let end = performance.now()

                this.lastSimulationTime = end - start

                this.renderer.render(this.scene, this.camera);
            }

            this.stats.end()
        }
    },

    get boidsAmount() {return Boid.boids.length},

    get fps() {return (1000/this.lastLoopTime).toFixed(1)}
}

