import {
  Vector2,
  Mesh
} from 'three';

class GeneratorItem_Traffic {
  constructor(x,z) {

    this.x = x;
    this.z = z;
    this.roadPositionx = 0;
    this.roadPositionz = 0;
    this.speed = 1.2;
    this.alt = 20;
    this.roadWidth = window.game.roadWidth;

    this.cars = [];

    let count = 1
    console.log('Reset car count')
    for (let j=0; j<4; j++) {
      let initialCarCount  = Math.floor(Math.random()*10);
      console.log('Car count: ' + initialCarCount);
      for (let k=0; k < initialCarCount ; k++) {
        // switch based on direction j
        switch (j) {
          case 0: 
            this.roadPositionx = this.x-this.roadWidth/2 - 2; 
            this.roadPositionz = this.z-this.roadWidth/2;
            break;
          case 1: 
            this.roadPositionx = this.x+this.roadWidth/2 + 2; 
            this.roadPositionz = this.z-this.roadWidth/2;
            break;
          case 2: 
            this.roadPositionx = this.x-this.roadWidth/2;
            this.roadPositionz = this.z-this.roadWidth/2 - 2; 
            break;
          case 3: 
            this.roadPositionx = this.x-this.roadWidth/2;
            this.roadPositionz = this.z+this.roadWidth/2 + 2; 
            break;
        }

        count++;

        // altitude
        // random 20, 40, 60 or 80
        this.alt = (Math.floor(Math.random()*4)+1)*20;     
        
        if(this.alt == 20) { this.speed = 0.2}
        if(this.alt == 40) { this.speed = 0.8}
        if(this.alt == 60) { this.speed = 1.2}
        if(this.alt == 80) { this.speed = 1.6}
        console.log('Added car:' + count + ' Loop:' + k);
        this.cars.push( new Car(j, this.roadPositionx, this.roadPositionz, this.speed, this.alt) );
      }
    }

  }
  remove() {
    for (var i=0; i<this.cars.length; i++) {
      this.cars[i].remove();
    }
  }
  update() {
    for (var i=0; i<this.cars.length; i++) {
      this.cars[i].update();
    }
  }
}

class Car {
  constructor(dir, spawn_x, spawn_z, speed, alt) {

    this.dir = dir; // 0, 1, 2, 3

    this.spawn_x = spawn_x;
    this.spawn_z = spawn_z;

    this.x = spawn_x;
    this.z = spawn_z;
    this.alt = alt;
    this.alt_offset = 0;
    this.speed_factor = speed;
    this.speed = speed;
    this.v = new Vector2();

    // create mesh

    let carGeos = ['car_01','car_02','car_03','car_04','car_05','car_06','car_07','car_08'];
    let geo = window.game.assets.getModel(carGeos[Math.floor(Math.random()*8)]);
    let mat = window.game.assets.getMaterial('cars');

    this.mesh = new Mesh( geo, mat );
    this.mesh.position.set(this.spawn_x, this.alt, this.spawn_z);
    window.game.scene.add( this.mesh );

    // east
    if (this.dir==0) {
      this.v.set(this.speed, 0);
      //this.alt = 20;
      this.mesh.rotateY(Math.PI/2);
      this.x -= Math.floor(Math.random()*20)*4;
    }
    // west
    if (this.dir==1) {
      this.v.set(-this.speed, 0);
      //this.alt = 60;
      this.mesh.rotateY(-Math.PI/2);
      this.x -= Math.floor(Math.random()*20)*4;
    }
    // north
    if (this.dir==2) {
      this.v.set(0, -this.speed);
      //this.alt = 40;
      this.mesh.rotateY(Math.PI);
      this.mesh.position.z = this.mesh.position.z-(Math.random()*2);
      this.z -= Math.floor(Math.random()*20)*4;
    }
    // south
    if (this.dir==3) {
      this.v.set(0, this.speed);
      //this.alt = 80;
      this.mesh.position.z = this.mesh.position.z-(Math.random()*2);
      this.z -= Math.floor(Math.random()*20)*4;
    }

    // random altitude 
    this.alt = alt //(Math.floor(Math.random()*4)+1)*20;

    // random very high altitude
    
    if (Math.random()<0.5) this.alt_offset = 200;
    if (Math.random()<0.2) {
      this.alt_offset = 400;
      this.speed_factor = 2;
    }
    

  }
  remove() {
    window.game.scene.remove(this.mesh);
  }
  update(){

    if (this.mesh!=null) {

      this.x += this.v.x * this.speed_factor;
      this.z += this.v.y * this.speed_factor;

      this.mesh.position.set(this.x, this.alt+this.alt_offset, this.z);

      // destroy
      if (this.mesh.position.distanceTo(window.game.player.body.position) > (1000+Math.random()*500)) {
        // remove
        // if (this.mesh) {
        //   scene.remove(this.mesh);
        //   this.mesh = null;
        // }
        // reverse
        this.v.multiplyScalar(-1);
      }

    }
  }
}

export { GeneratorItem_Traffic }