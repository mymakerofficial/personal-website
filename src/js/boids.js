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
        this.velocity = Math.random() / 10;
        this.object.position.set(Math.random() * 10 - 5, Math.random() * 6 - 3, Math.random() * 6 - 3)
        this.object.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)

        Boid.boids.push(this);
    }

    update() {
        let inRange = this.getBoidsInRange();
        if(inRange.length > 0){
            this.flyTowardsCenter(inRange);
            this.avoidCollision(inRange);
            this.align(inRange);
            this.keepInBounds();
        }
        this.object.translateY( this.velocity );
    }

    getBoidsInRange() {
        let list = []
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
                list.push(b);
            }
        }
        return list;
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

    flyTowardsCenter(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < inRange.length; i++){
            x += inRange[i].object.position.x;
            y += inRange[i].object.position.y;
            z += inRange[i].object.position.z;
        }

        // calculate average position of boids in view
        x /= inRange.length;
        y /= inRange.length;
        z /= inRange.length;

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

    avoidCollision(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < inRange.length; i++){
            let b = inRange[i]

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

    align(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;
        let v = 0;

        for(let i = 0; i < inRange.length; i++){
            x += inRange[i].object.rotation.x;
            y += inRange[i].object.rotation.y;
            z += inRange[i].object.rotation.z;
            v += inRange[i].velocity;
        }

        // calculate average rotation
        x /= inRange.length;
        y /= inRange.length;
        z /= inRange.length;
        // calculate average velocity
        v /= inRange.length;

        // rotate to average
        this.object.rotation.set(
            this.object.rotation.x + (x - this.object.rotation.x) * Boid.alignFactor,
            this.object.rotation.y + (y - this.object.rotation.y) * Boid.alignFactor,
            this.object.rotation.z + (z - this.object.rotation.z) * Boid.alignFactor
        )

        // adjust velocity
        this.velocity += (v - this.velocity) * 0.02;
    }
}

export { Boid }