import * as THREE from 'three';

class Boid {
    static boids = [];
    static visualRange = 5;
    static minDistance = 0.8;
    static centeringFactor = 0.8;
    static avoidFactor = 0.02;
    static alignFactor = 0.02

    constructor() {
        this.object = new THREE.Object3D()
        this.object.position.set(Math.random() * 10 - 5, Math.random() * 6 - 3, Math.random() * 6 - 3)
        this.object.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)

        Boid.boids.push(this);
    }

    update() {
        this.flyTowardsCenter();
        this.avoidCollision();
        this.align();
        this.keepInBounds();
        this.object.translateY( 0.02 );
    }

    keepInBounds(){
        //when boid goes out of bounds invert position on axis

        if(Math.abs(this.object.position.x) > 10) {
            this.object.position.setX(-this.object.position.x)
            this.object.lookAt(0,0,0)
            this.object.translateY( 2 );
        }
        if(Math.abs(this.object.position.y) > 6) {
            this.object.position.setY(-this.object.position.y)
            this.object.lookAt(0,0,0)
            this.object.translateY( 2 );
        }
        if(Math.abs(this.object.position.z) > 10) {
            this.object.position.setZ(-this.object.position.z)
            this.object.lookAt(0,0,0)
            this.object.translateY( 2 );
        }
    }

    flyTowardsCenter() {
        let x = 0;
        let y = 0;
        let z = 0;
        let count = 0;

        for(let i = 0; i < Boid.boids.length; i++){
            let b = Boid.boids[i]

            // deference between positions
            let offset = new THREE.Vector3(
                b.object.position.x - this.object.position.x,
                b.object.position.y - this.object.position.y,
                b.object.position.z - this.object.position.z
            )
            // calculate the square root distance
            let sqrDistance = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z
            // if boid is inside visual range add to sum of positions
            if (sqrDistance < Boid.visualRange * Boid.visualRange) {
                x += b.object.position.x;
                y += b.object.position.y;
                z += b.object.position.z;
                count += 1;
            }
        }

        if (count > 0) {
            // calculate average position of boids in view
            x = x / count;
            y = y / count;
            z = z / count;

            // calculate direction vector for center of boids
            let moveDir = new THREE.Euler(
                this.object.position.x - x,
                this.object.position.y - y,
                this.object.position.z - z
            );

            // rotate to center
            this.object.rotation.set(
                this.object.rotation.x + (moveDir.x - this.object.rotation.x) * Boid.centeringFactor,
                this.object.rotation.y + (moveDir.y - this.object.rotation.y) * Boid.centeringFactor,
                this.object.rotation.z + (moveDir.z - this.object.rotation.z) * Boid.centeringFactor
            )
        }
    }

    avoidCollision() {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < Boid.boids.length; i++){
            let b = Boid.boids[i]

            // deference between positions
            let offset = new THREE.Vector3(
                b.object.position.x - this.object.position.x,
                b.object.position.y - this.object.position.y,
                b.object.position.z - this.object.position.z
            )
            // calculate the square root distance
            let sqrDistance = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z
            // if boid is to close add difference in position
            if (sqrDistance < Boid.minDistance * Boid.minDistance) {
                x += this.object.position.x - b.object.position.x;
                y += this.object.position.y - b.object.position.y;
                z += this.object.position.z - b.object.position.z;
            }
        }

        // rotate away
        this.object.rotation.set(
            this.object.rotation.x + (x - this.object.rotation.x) * Boid.avoidFactor,
            this.object.rotation.y + (y - this.object.rotation.y) * Boid.avoidFactor,
            this.object.rotation.z + (z - this.object.rotation.z) * Boid.avoidFactor
        )
    }

    align() {
        let x = 0;
        let y = 0;
        let z = 0;
        let count = 0;

        for(let i = 0; i < Boid.boids.length; i++){
            let b = Boid.boids[i]

            // deference between positions
            let offset = new THREE.Vector3(
                b.object.position.x - this.object.position.x,
                b.object.position.y - this.object.position.y,
                b.object.position.z - this.object.position.z
            )
            // calculate the square root distance
            let sqrDistance = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z
            // if boid is inside visual range add to sum of rotation
            if (sqrDistance < Boid.visualRange * Boid.visualRange) {
                x += b.object.rotation.x;
                y += b.object.rotation.y;
                z += b.object.rotation.z;
                count += 1;
            }
        }

        if(count > 0){
            // calculate average rotation
            x = x / count;
            y = y / count;
            z = z / count;

            // rotate to average
            this.object.rotation.set(
                this.object.rotation.x + (x - this.object.rotation.x) * Boid.alignFactor,
                this.object.rotation.y + (y - this.object.rotation.y) * Boid.alignFactor,
                this.object.rotation.z + (z - this.object.rotation.z) * Boid.alignFactor
            )
        }
    }
}

export { Boid }