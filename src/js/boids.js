import * as THREE from 'three';

class Boid {
    static boids = [];
    static visualRange = 2;

    constructor() {
        this.object = new THREE.Object3D()
        this.object.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2)
        this.object.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)

        Boid.boids.push(this);
    }

    update() {
        this.flyTowardsCenter();
        this.keepInBounds();
        this.object.translateY( 0.01 );
    }

    nClosestBoids(n){
        // make copy of list to be sorted
        let sorted = Boid.boids.slice();
        // sort by distance
        sorted.sort((a, b) => this.object.position.distanceTo(a.object.position) - this.object.position.distanceTo(b.object.position));

        return sorted.slice(1, n + 1);
    }

    keepInBounds(){
        if(this.object.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 1){
            this.object.quaternion.setFromEuler(
                new THREE.Euler(
                    this.object.rotation.x + this.object.position.x / 100,
                    this.object.rotation.y + this.object.position.y / 100,
                    this.object.rotation.z + this.object.position.z / 100
                )
            )
        }
    }

    flyTowardsCenter() {
        //const centeringFactor = 0.005; // adjust velocity by this %

        let x = 0;
        let y = 0;
        let z = 0;
        let count = 0;
        let insideRange = true;

        let list = this.nClosestBoids(Boid.boids.length);

        while(insideRange && count < list.length){
            if (this.object.position.distanceTo(list[count].object.position) < Boid.visualRange) {
                x += list[count].object.position.x;
                y += list[count].object.position.y;
                z += list[count].object.position.z;
                count += 1;
            }else {
                insideRange = false;
            }
        }


        if (count > 0) {
            x = x / count;
            y = y / count;
            z = z / count;

            let moveDir = new THREE.Euler(
                this.object.position.x - x,
                this.object.position.y - y,
                this.object.position.z - z
            );


            this.object.quaternion.setFromEuler(
                new THREE.Euler(
                    this.object.rotation.x + (moveDir.x - this.object.rotation.x) / 100,
                    this.object.rotation.y + (moveDir.y - this.object.rotation.y) / 100,
                    this.object.rotation.z + (moveDir.z - this.object.rotation.z) / 100
                )
            )
        }
    }
}

export { Boid }