import * as THREE from 'three';

class Boid {
    static boids = [];
    static visualRange = 3;
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
            let r1 = this.flyTowardsCenter(inRange);
            let r2 = this.avoidCollision(inRange);
            let r3 = this.alignRotation(inRange)
            let v = this.alignVelocity(inRange);

            // adjust rotation
            this.object.rotation.set(
                this.object.rotation.x + r1.x + r2.x + r3.x,
                this.object.rotation.y + r1.y + r2.y + r3.y,
                this.object.rotation.z + r1.z + r2.z + r3.z
            );

            // adjust velocity
            this.velocity += v;

            this.keepInBounds();
        }
        this.object.translateY( this.velocity );
    }

    getBoidsInRange() {
        let list = {
            length: 0,
            positionX: [],
            positionY: [],
            positionZ: [],
            rotationX: [],
            rotationY: [],
            rotationZ: [],
            velocity: [],
            distance: [],
        }
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
                list.positionX.push(b.object.position.x);
                list.positionY.push(b.object.position.y);
                list.positionZ.push(b.object.position.z);
                list.rotationX.push(b.object.rotation.x);
                list.rotationY.push(b.object.rotation.y);
                list.rotationZ.push(b.object.rotation.z);
                list.velocity.push(b.velocity);
                list.distance.push(sqrDistance);

                list.length++
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
        // calculate average position
        let x = inRange.positionX.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let y = inRange.positionY.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let z = inRange.positionZ.reduce((pv, cv) => pv + cv, 0) / inRange.length

        // calculate direction vector for center of boids
        let moveDir = new THREE.Euler(
            this.object.position.x - x,
            this.object.position.y - y,
            this.object.position.z - z
        );

        // return rotation adjustment
        return new THREE.Euler(
            (moveDir.x - this.object.rotation.x) * Boid.centeringFactor,
            (moveDir.y - this.object.rotation.y) * Boid.centeringFactor,
            (moveDir.z - this.object.rotation.z) * Boid.centeringFactor
        )
    }

    avoidCollision(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < inRange.length; i++){
            if (inRange.distance[i] < Boid.minDistance * Boid.minDistance) {
                x += this.object.position.x - inRange.positionX[i];
                y += this.object.position.y - inRange.positionY[i];
                z += this.object.position.z - inRange.positionZ[i];
            }
        }

        // return rotation adjustment
        return new THREE.Euler(
            (x - this.object.rotation.x) * Boid.avoidFactor,
            (y - this.object.rotation.y) * Boid.avoidFactor,
            (z - this.object.rotation.z) * Boid.avoidFactor
        )
    }

    alignRotation(inRange) {
        // calculate average rotation
        let x = inRange.rotationX.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let y = inRange.rotationY.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let z = inRange.rotationZ.reduce((pv, cv) => pv + cv, 0) / inRange.length


        // return rotation adjustment
        return new THREE.Euler(
            (x - this.object.rotation.x) * Boid.alignFactor,
            (y - this.object.rotation.y) * Boid.alignFactor,
            (z - this.object.rotation.z) * Boid.alignFactor
        )
    }

    alignVelocity(inRange){
        // calculate average velocity
        let v = inRange.velocity.reduce((pv, cv) => pv + cv, 0) / inRange.length

        // return velocity adjustment
        return (v - this.velocity) * 0.02
    }
}

export { Boid }