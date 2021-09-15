import * as THREE from 'three';

class Boid {
    static boids = []; // list of all boids
    static visualRange = 2; // a boid can only interact with other boids that are closer then this distance
    static minDistance = 0.6; // distance to stay away from other boids
    static centeringFactor = 0.008; // % to adjust velocity towards center of mass
    static avoidFactor = 0.005; // % to adjust velocity to stay away from other boids
    static alignFactor = 0.02; // % to adjust velocity to align direction with other boids
    static boundTurnFactor = 1; // velocity to turn around when out of bounds
    static speedLimit = 0.1; // max speed of the boids

    static boundaryFrustum = new THREE.Frustum();

    constructor() {
        // position vector
        this.position = new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2)
        // direction vector
        this.direction = new THREE.Vector3((Math.random() * 2 - 1) / 10, (Math.random() * 2 - 1) / 10, (Math.random() * 2 - 1) / 10);

        // add this boid to list of all boids
        Boid.boids.push(this);
    }

    update(deltaTime) {
        // create list with all boids that are in visual range
        let inRange = this.getBoidsInRange();

        // if there are boids in visual range calculate velocity
        if(inRange.length > 0){
            this.flyTowardsCenter(inRange)
            this.avoidCollision(inRange)
            this.alignWithOthers(inRange)
            this.limitSpeed()
            this.keepInBounds()
        }

        this.position.addScaledVector(this.direction, deltaTime / 16.33)
    }

    getBoidsInRange() {
        // add all relevant attributes of boids in range to individual lists
        // this improves performance because using .reduce on a list
        // seems to be faster then looping through it

        let list = {
            length: 0,
            positionX: [],
            positionY: [],
            positionZ: [],
            directionX: [],
            directionY: [],
            directionZ: [],
            distance: [],
        }

        for(let i = 0; i < Boid.boids.length; i++){
            let b = Boid.boids[i]

            // offset between positions
            let offset = new THREE.Vector3(
                b.position.x - this.position.x,
                b.position.y - this.position.y,
                b.position.z - this.position.z
            )
            // calculate the square root distance
            let sqrDistance = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z

            // add position, direction vector and distance of boids that are in visual range to lists so they can be summed up faster
            if (sqrDistance < Boid.visualRange * Boid.visualRange) {
                list.positionX.push(b.position.x);
                list.positionY.push(b.position.y);
                list.positionZ.push(b.position.z);

                list.directionX.push(b.direction.x);
                list.directionY.push(b.direction.y);
                list.directionZ.push(b.direction.z);

                list.distance.push(sqrDistance);

                list.length++
            }
        }

        return list;
    }

    keepInBounds(){
        if (this.position.x < -10) {
            this.direction.x += Boid.boundTurnFactor;
        }
        if (this.position.x > 10) {
            this.direction.x -= Boid.boundTurnFactor
        }
        if (this.position.y < -10) {
            this.direction.y += Boid.boundTurnFactor;
        }
        if (this.position.y > 10) {
            this.direction.y -= Boid.boundTurnFactor;
        }
        if (this.position.z < -10) {
            this.direction.z += Boid.boundTurnFactor;
        }
        if (this.position.z > 10) {
            this.direction.z -= Boid.boundTurnFactor;
        }
    }

    // this keeps the boids from exceeding terminal velocity and escaping this plane of existence
    limitSpeed() {
        let speed = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y + this.direction.z * this.direction.z);

        this.direction = new THREE.Vector3(
            (this.direction.x / speed) * Boid.speedLimit,
            (this.direction.y / speed) * Boid.speedLimit,
            (this.direction.z / speed) * Boid.speedLimit,
        )
    }

    // calculate center of mass of other boids in visual range and adjust velocity in that direction
    flyTowardsCenter(inRange) {
        // calculate average position of boids in range
        let x = inRange.positionX.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let y = inRange.positionY.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let z = inRange.positionZ.reduce((pv, cv) => pv + cv, 0) / inRange.length

        // calculate direction vector for center of boids and add this to velocity
        this.direction.add(new THREE.Vector3(
            (x - this.position.x) * Boid.centeringFactor,
            (y - this.position.y) * Boid.centeringFactor,
            (z - this.position.z) * Boid.centeringFactor
        ))
    }

    avoidCollision(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < inRange.length; i++){
            if (inRange.distance[i] < Boid.minDistance * Boid.minDistance) {
                // sum up offset position between other boids and self
                x += this.position.x - inRange.positionX[i];
                y += this.position.y - inRange.positionY[i];
                z += this.position.z - inRange.positionZ[i];
            }
        }

        // add velocity to escape from boids that are to close
        this.direction.add(new THREE.Vector3(
            x * Boid.avoidFactor,
            y * Boid.avoidFactor,
            z * Boid.avoidFactor
        ))
    }

    // calculate average directional vector of other boids in visual range
    // and adjust own direction slightly to match
    alignWithOthers(inRange) {
        // calculate average direction of boids in visual range
        let x = inRange.directionX.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let y = inRange.directionY.reduce((pv, cv) => pv + cv, 0) / inRange.length
        let z = inRange.directionZ.reduce((pv, cv) => pv + cv, 0) / inRange.length

        // add average directional vector of boids in range to own direction vector
        this.direction.add(new THREE.Euler(
            x * Boid.alignFactor,
            y * Boid.alignFactor,
            z * Boid.alignFactor
        ))
    }
}

export { Boid }