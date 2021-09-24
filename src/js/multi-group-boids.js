/*

    Modified boids algorithm

    Different Groups:
    We assign every boid a random groups in the form of a number.
    This boid will now only fly towards other boids with the same number and avoid others.
    This is to keep the boids from forming one big group after a few minutes, dividing them up guarantees
    that they will always form the desired amount of groups.

 */


import * as THREE from 'three';

class Boid {
    static boids = []; // list of all boids
    static visualRange = 2.4; // a boid can only interact with other boids that are closer then this distance
    static minDistance = 0.6; // distance to stay away from other boids
    static centeringFactor = 0.008; // % to adjust velocity towards center of mass
    static avoidFactor = 0.004; // % to adjust velocity to stay away from other boids
    static alignFactor = 0.02; // % to adjust velocity to align direction with other boids
    static boundTurnFactor = 0.1; // velocity to turn around when out of bounds
    static speedLimit = 0.1; // max speed of the boids

    static groupAmount = 3;
    static groupVisualRange = 4; // how far boids can see boids from other groups
    static groupAvoidFactor = 0.002; // % to adjust velocity to stay away from other groups

    // boundary size
    static boundaryX = 10
    static boundaryY = 10
    static boundaryZ = 10

    constructor() {
        // position vector
        this.position = new THREE.Vector3()
        // direction vector
        this.direction = new THREE.Vector3()
        // group
        this.group = 0

        // add this boid to list of all boids
        Boid.boids.push(this);

        this.reset()
    }

    reset() {
        let a = Math.random() * Math.PI * 2
        let r = Math.random() * 10 + 15
        let x = r * Math.cos(a)
        let y = r * Math.sin(a)
        this.position = new THREE.Vector3(x, y, Math.random() * 4 - 2)

        this.direction = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);

        this.group = Math.floor(Math.random() * Boid.groupAmount)
    }

    update(deltaTime) {
        // create list with all boids that are in visual range
        let inRange = this.getBoidsInRange();

        // if there are boids in visual range calculate velocity
        if(inRange.sameGroup.length > 0){
            this.flyTowardsCenter(inRange.sameGroup)
            this.avoidCollision(inRange.sameGroup)
            this.alignWithOthers(inRange.sameGroup)
        }
        if(inRange.otherGroups.length > 0){
            this.avoidOtherGroups(inRange.otherGroups)
        }

        this.limitSpeed()
        this.keepInBounds()

        this.position.addScaledVector(this.direction, deltaTime / 16.33)
    }

    getBoidsInRange() {
        // add all relevant attributes of boids in range to individual lists
        // this improves performance because using .reduce on a list
        // seems to be faster then looping through it

        // list of boids of same group that are in visual range
        let sameGroup = {
            length: 0,
            positionX: [],
            positionY: [],
            positionZ: [],
            directionX: [],
            directionY: [],
            directionZ: [],
            distance: [],
        }

        // list of boids from other groups that are in visual range
        let otherGroups = {
            length: 0,
            positionX: [],
            positionY: [],
            positionZ: []
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

            if (sqrDistance < Boid.visualRange * Boid.visualRange && b.group === this.group) {
                sameGroup.positionX.push(b.position.x);
                sameGroup.positionY.push(b.position.y);
                sameGroup.positionZ.push(b.position.z);

                sameGroup.directionX.push(b.direction.x);
                sameGroup.directionY.push(b.direction.y);
                sameGroup.directionZ.push(b.direction.z);

                sameGroup.distance.push(sqrDistance);

                sameGroup.length++
            }

            if (sqrDistance < Boid.groupVisualRange * Boid.groupVisualRange && b.group !== this.group) {
                otherGroups.positionX.push(b.position.x);
                otherGroups.positionY.push(b.position.y);
                otherGroups.positionZ.push(b.position.z);

                otherGroups.length++
            }
        }

        return {sameGroup: sameGroup, otherGroups: otherGroups};
    }

    keepInBounds(){
        if(!this.ignoreBounds){
            if (this.position.x < -Boid.boundaryX) {
                this.direction.x += Boid.boundTurnFactor;
            }
            if (this.position.x > Boid.boundaryX) {
                this.direction.x -= Boid.boundTurnFactor
            }
            if (this.position.y < -Boid.boundaryY) {
                this.direction.y += Boid.boundTurnFactor;
            }
            if (this.position.y > Boid.boundaryY) {
                this.direction.y -= Boid.boundTurnFactor;
            }
            if (this.position.z < -Boid.boundaryZ) {
                this.direction.z += Boid.boundTurnFactor;
            }
            if (this.position.z > 5) {
                this.direction.z -= Boid.boundTurnFactor;
            }
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

    avoidOtherGroups(inRange) {
        let x = 0;
        let y = 0;
        let z = 0;

        for(let i = 0; i < inRange.length; i++){
            // sum up offset position between other boids and self
            x += this.position.x - inRange.positionX[i];
            y += this.position.y - inRange.positionY[i];
            z += this.position.z - inRange.positionZ[i];
        }

        // add velocity to escape from boids that are to close
        this.direction.add(new THREE.Vector3(
            x * Boid.groupAvoidFactor,
            y * Boid.groupAvoidFactor,
            z * Boid.groupAvoidFactor
        ))
    }
}

export { Boid }