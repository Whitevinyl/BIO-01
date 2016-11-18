
//-------------------------------------------------------------------------------------------
//  BIO
//-------------------------------------------------------------------------------------------


var materialType = THREE.MeshBasicMaterial;




function addlighting() {
    materialType = THREE.MeshLambertMaterial;

    var light = new THREE.DirectionalLight( 0xefefff, 0.1 );
    light.position.set( 1, 2, 2 ).normalize();
    scene3d.add( light );

    light = new THREE.AmbientLight( 0xffffff, 0.9 );
    scene3d.add( light );
}



function Bio3d() {
    this.obj = new THREE.Object3D();
    scene3d.add( this.obj );

    this.terrain = null;
    this.rocks = [];
    this.spawners = [];

    this.simplex = new SimplexNoise();
    this.size = 2.5;
}


Bio3d.prototype.setup = function() {

    var i,s,l,geometry,material;


    // TERRAIN //
    geometry = new THREE.PlaneGeometry( 8, 8, 24, 24 );
    material = new THREE.MeshBasicMaterial( {color: col3d} );

    this.terrain = new THREE.Mesh( geometry, material );
    this.terrain.rotation.x = -TAU/4;
    meshUpdate(this.terrain);

    l = this.terrain.geometry.vertices.length;
    for (i=0; i<l; i++) {
        var vert = this.terrain.geometry.vertices[i];
        vert.y = this.spawnHeight(vert.x, vert.z);
    }
    this.terrain.geometry.verticesNeedUpdate = true;
    this.obj.add( this.terrain );



    // CREATE ROCKS //
    rockMat3d = new materialType( { color: colToHex(rockCols[0]) } );
    for (i=0; i<5; i++) {

        if (i===0) {
            s = tombola.rangeFloat(0.25,0.75);
        } else {
            s = tombola.rangeFloat(0.05,0.3);
        }

        var rock = new Rock3d(s);
        geometry = rockMesh(s);

        rock.mesh = new THREE.Mesh( geometry, rockMat3d );
        meshUpdate(rock.mesh);
        rock.obj = new THREE.Object3D();
        rock.obj.add( rock.mesh );
        this.obj.add( rock.obj );

        rock.reset();
        this.rocks.push( rock );
    }

    var spawner;

    spawner = new Moss3d();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new PinkSpores();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new MagentaSpores();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new BlackSpores();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new SushiSpores();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new TubeSpores();
    spawner.setup();
    this.spawners.push(spawner);

    spawner = new SmallTubeSpores();
    spawner.setup();
    this.spawners.push(spawner);
};




Bio3d.prototype.resize = function() {
};


Bio3d.prototype.update = function() {


    var l = this.spawners.length;
    for (var i=0; i<l; i++) {
        this.spawners[i].update();
    }


    // ROTATE //
    this.obj.rotation.y += ((TAU/360) * 0.05);

    update3DCols();
};




Bio3d.prototype.spawnHeight = function(x,z) {
    var d = 4.8;
    var h = 0.9;
    return this.simplex.noise(500 + (x/d), 500 + (z/d)) * h;
};



//-------------------------------------------------------------------------------------------
//  SPORE
//-------------------------------------------------------------------------------------------


function Spore3d() {
    this.obj = null;
    this.mesh = null;
    this.speed = new Vector(0,0);
    this.age = 0;
    var b = tombola.range(20,120);
    this.color = new RGBA(255,tombola.range(b+5,b+35),b,1);
    this.flying = false;
    this.shrinking = false;
}


Spore3d.prototype.reset = function(spawn) {

    var i;
    scale3D(this.obj,0.01);

    var range = 0.65;

    // positioning //
    var pos = this.obj.position;
    pos.x = spawn.x + tombola.rangeFloat(-range,range);
    pos.z = spawn.z + tombola.rangeFloat(-range,range);
    pos.y = bio.spawnHeight(pos.x,pos.z);


    // vertices //
    this.mesh.geometry.vertices[4].y = 0;
    for (i=1; i<4; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z)- pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    this.speed = new Vector(0,tombola.rangeFloat(0.001,0.005));
    var s = 60;
    this.age = tombola.range(s*11,s*22);
    this.flying = false;
    this.shrinking = false;
};


Spore3d.prototype.init = function() {
    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(0,s*18);
};


Spore3d.prototype.update = function(spawn) {

    if (this.age===0 && !this.shrinking && !this.flying) {

        if (tombola.percent(3)) {
            this.flying = true;
        }
        else {
            if (tombola.percent(30)) {
                this.flying = true;
                this.shrinking = true;
            }
            else {
                this.shrinking = true;
            }
        }
    }

    if (this.age>0){
        this.age -= 1;
    }

    if (this.flying) {
        this.speed.y *= 1.03;
        this.obj.position.y += this.speed.y;

        for (var i=1; i<4; i++) {
            var vert = this.mesh.geometry.vertices[i];
            vert.y = lerp(vert.y,0,10);
        }
        this.mesh.geometry.vertices[4].y -= 0.005;
        this.mesh.geometry.verticesNeedUpdate = true;
    }

    if (this.shrinking) {

        if (this.obj.scale.x >0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,2));
        } else {
            this.reset(spawn);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,3));
        }

        if (this.obj.position.y > 40) {
            this.reset(spawn);
        }

    }
};


//-------------------------------------------------------------------------------------------
//  POD
//-------------------------------------------------------------------------------------------


function Pod3d() {
    this.obj = null;
    this.mesh = null;
    this.age = 0;
    var b = tombola.range(45,70);
    this.color = new RGBA(180,10,b,1);
    this.shrinking = false;
}


Pod3d.prototype.reset = function(spawn) {

    scale3D(this.obj,0.01);

    var range = 0.2;
    var pos = this.obj.position;
    pos.x = spawn.x + tombola.rangeFloat(-range,range);
    pos.z = spawn.z + tombola.rangeFloat(-range,range);
    pos.y = bio.spawnHeight(pos.x,pos.z);

    var l = this.mesh.geometry.vertices.length;
    for (var i=1; i<l; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z)- pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    var s = 60;
    this.age = tombola.range(s*1.5,s*2.5);
    this.shrinking = false;
};


Pod3d.prototype.init = function() {
    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(0,s*8);
};


Pod3d.prototype.update = function(spawn) {

    if (this.age===0 && !this.shrinking) {
        this.shrinking = true;
    }

    if (this.age>0){
        this.age -= 1;
    }


    if (this.shrinking) {

        if (this.obj.scale.x >0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,10));
        } else {
            this.reset(spawn);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,5));
        }

    }
};


//-------------------------------------------------------------------------------------------
//  PIP
//-------------------------------------------------------------------------------------------


function Pip3d() {
    this.obj = null;
    this.mesh = null;
    this.age = 0;
    this.shrinking = false;
}


Pip3d.prototype.reset = function(spawn) {

    scale3D(this.obj,0.01);

    var range = 0.2;
    var pos = this.obj.position;
    pos.x = spawn.x + tombola.rangeFloat(-range,range);
    pos.z = spawn.z + tombola.rangeFloat(-range,range);
    pos.y = bio.spawnHeight(pos.x,pos.z);

    var l = this.mesh.geometry.vertices.length;
    for (var i=1; i<l; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z)- pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    var s = 60;
    this.age = tombola.range(s*3,s*6);
    this.shrinking = false;
};


Pip3d.prototype.init = function() {
    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(s*6,s*9);
};


Pip3d.prototype.update = function(spawn) {

    if (this.age===0) {
        this.shrinking = true;
    } else {
        this.age -= 1;
    }


    if (this.shrinking) {

        if (this.obj.scale.x > 0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,10));
        } else {
            this.reset(spawn);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,5));
        }

    }
};


//-------------------------------------------------------------------------------------------
//  SUSHI
//-------------------------------------------------------------------------------------------


function Sushi3d() {
    this.obj = null;
    this.mesh = null;
    this.age = 0;
    this.shrinking = false;
}


Sushi3d.prototype.reset = function(spawn,spores) {

    scale3D(this.obj,0.01);
    meshRotate(this.mesh);

    var range = 0.4;
    var pos = this.obj.position;
    var clear = false;
    var i,l;

    spores = spores || [];
    l = spores.length;
    while (clear===false) {

        clear = true;
        pos.x = spawn.x + tombola.rangeFloat(-range,range);
        pos.z = spawn.z + tombola.rangeFloat(-range,range);
        
        for ( i=0; i<l; i++) {
            var spore = spores[i];
            if (spore!==this) {
                var d = pointDistance(spore.obj.position,pos);
                if (d<0.4) {
                    clear = false;
                }
            }
        }
    }


    pos.y = bio.spawnHeight(pos.x,pos.z);


    l = this.mesh.geometry.vertices.length;
    for (i=6; i<l; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z)- pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    var s = 60;
    this.age = tombola.range(s*70,s*100);
    this.shrinking = false;
};


Sushi3d.prototype.init = function() {
    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(s*10,s*35);
};


Sushi3d.prototype.update = function(spawn,spores) {

    if (this.age===0) {
        this.shrinking = true;
    } else {
        this.age -= 1;
    }


    if (this.shrinking) {

        if (this.obj.scale.x > 0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,6));
        } else {
            this.reset(spawn,spores);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,4));
        }

    }
};


//-------------------------------------------------------------------------------------------
//  BED
//-------------------------------------------------------------------------------------------


function Bed3d(range) {
    this.obj = null;
    this.mesh = null;
    this.age = 10;
    this.shrinking = false;
    this.range = range || 0.5;
}


Bed3d.prototype.reset = function(spawn) {
    this.shrinking = false;

    // SCALE & POSITION //
    scale3D(this.obj,0.01);
    var pos = this.obj.position;
    pos.x = spawn.x + tombola.rangeFloat(-this.range,this.range);
    pos.z = spawn.z + tombola.rangeFloat(-this.range,this.range);
    pos.y = bio.spawnHeight(pos.x,pos.z);


    // VERTEX HEIGHT //
    var l = this.mesh.geometry.vertices.length;
    var peaks = [0,5,6,7,12,16];
    for (var i=0; i<l; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z) - pos.y;
    }
    for (i=0; i<peaks.length; i++) {
        this.mesh.geometry.vertices[peaks[i]].y += 0.075;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    // AGE //
    var s = 60;
    this.age = tombola.range(s*8,s*16);
};


Bed3d.prototype.init = function() {

    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(0,s*10);
};


Bed3d.prototype.update = function(spawn) {

    if (this.age===0) {
        this.shrinking = true;
    }
    else {
        this.age -= 1;
    }

    if (this.shrinking) {

        if (this.obj.scale.x >0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,0.6));
        } else {
            this.reset(spawn);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,3));
        }

    }
};


//-------------------------------------------------------------------------------------------
//  DUST
//-------------------------------------------------------------------------------------------


function Dust3d() {
    this.obj = null;
    this.mesh = null;
    this.age = 10;
}


Dust3d.prototype.reset = function(spawn) {

    var range = 0.4;

    this.obj.position.x = spawn.x + tombola.rangeFloat(-range,range);
    this.obj.position.z = spawn.z + tombola.rangeFloat(-range,range);
    this.obj.position.y = bio.spawnHeight(this.obj.position.x,this.obj.position.z);


    var l = this.mesh.geometry.vertices.length;
    for (var i=0; i<l; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(this.obj.position.x + vert.x, this.obj.position.z + vert.z) - this.obj.position.y + 0.01;
    }
    this.mesh.geometry.verticesNeedUpdate = true;

    var s = 60;
    this.age = tombola.range(s*3,s*7);
};


Dust3d.prototype.update = function(spawn) {

    if (this.age===0) {
        this.reset(spawn);
    }

    if (this.age>0){
        this.age -= 1;
    }
};




//-------------------------------------------------------------------------------------------
//  ROCK
//-------------------------------------------------------------------------------------------


function Rock3d(s) {
    this.obj = null;
    this.mesh = null;
    this.speed = null;
    this.age = 10;
    this.shrinking = false;
    this.height = s * tombola.rangeFloat(0.4,3);
}


Rock3d.prototype.reset = function() {

    var range = 2.5;
    var pos = this.obj.position;
    pos.x = tombola.rangeFloat(-range,range);
    pos.z = tombola.rangeFloat(-range,range);
    pos.y = bio.spawnHeight(pos.x,pos.z);


    for (var i=0; i<6; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z) - pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;
};


//-------------------------------------------------------------------------------------------
//  TUBE (CUBOID)
//-------------------------------------------------------------------------------------------


function Tube3d() {
    this.obj = null;
    this.mesh = null;
    this.age = 0;
    this.shrinking = false;
}


Tube3d.prototype.reset = function(spawn,spores) {

    scale3D(this.obj,0.01);
    meshRotate(this.mesh);

    var range = 0.2;
    var pos = this.obj.position;
    var clear = false;
    var i,l;

    spores = spores || [];
    pos.x = spawn.x + tombola.rangeFloat(-range,range);
    pos.z = spawn.z + tombola.rangeFloat(-range,range);


    /*l = spores.length;
    while (clear===false) {

        clear = true;
        pos.x = spawn.x + tombola.rangeFloat(-range,range);
        pos.z = spawn.z + tombola.rangeFloat(-range,range);

        for ( i=0; i<l; i++) {
            var spore = spores[i];
            if (spore!==this) {
                var d = pointDistance(spore.obj.position,pos);
                if (d<0.4) {
                    clear = false;
                }
            }
        }
    }*/


    pos.y = bio.spawnHeight(pos.x,pos.z);


    //l = this.mesh.geometry.vertices.length;
    for (i=0; i<4; i++) {
        var vert = this.mesh.geometry.vertices[i];
        vert.y = bio.spawnHeight(pos.x + vert.x, pos.z + vert.z)- pos.y;
    }
    this.mesh.geometry.verticesNeedUpdate = true;


    var s = 60;
    this.age = tombola.range(s*15,s*25);
    this.shrinking = false;
};


Tube3d.prototype.init = function() {
    this.obj.position.x = 2000;
    var s = 60;
    this.age = tombola.range(s*10,s*18);
};


Tube3d.prototype.update = function(spawn,spores) {

    if (this.age===0) {
        this.shrinking = true;
    } else {
        this.age -= 1;
    }


    if (this.shrinking) {

        if (this.obj.scale.x > 0.1) {
            scale3D(this.obj,lerp(this.obj.scale.x,0,6));
        } else {
            this.reset(spawn,spores);
        }

    } else {

        if (this.obj.scale.x < 1) {
            scale3D(this.obj,lerp(this.obj.scale.x,1,4));
        }

    }
};


//-------------------------------------------------------------------------------------------
//  MOSS
//-------------------------------------------------------------------------------------------


function Moss3d() {
    this.beds = [];
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


Moss3d.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE BEDS //
    for (i=0; i<5; i++) {
        s = tombola.rangeFloat(0.2,0.35);

        var bed = new Bed3d(0.3);

        geometry = multiHex(s);
        material = new materialType( { color: colToHex(new RGBA(50,tombola.range(175,190),160,1)) } );
        bed.mesh = new THREE.Mesh( geometry, material );
        meshRotate(bed.mesh);
        bed.obj = new THREE.Object3D();
        bed.obj.add( bed.mesh );
        bio.obj.add( bed.obj );

        bed.reset(this.spawn);
        bed.init();
        this.beds.push( bed );
    }

    // CREATE SPORES //
    for (i=0; i<5; i++) {
        var spore = new Pip3d();

        s = tombola.rangeFloat(0.05,0.1);
        geometry = quadMesh(s,0.15);
        var c = new RGBA(240,45,55);
        c = new RGBA(255,245,125);
        material = new materialType( { color: colToHex(c) } );
        spore.mesh = new THREE.Mesh( geometry, material );
        meshRotate(spore.mesh);
        spore.obj = new THREE.Object3D();
        spore.obj.add( spore.mesh );
        bio.obj.add( spore.obj );

        spore.reset(this.spawn);
        spore.init();
        this.spores.push( spore );
    }

};


Moss3d.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===60) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // BED //
    l = this.beds.length;
    for (i=0; i<l; i++) {
        this.beds[i].update(this.spawn);
    }

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn);
    }
};

Moss3d.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.005;
};


//-------------------------------------------------------------------------------------------
//  PINK SPORES
//-------------------------------------------------------------------------------------------


function PinkSpores() {
    this.spores = [];
    this.beds = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


PinkSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<160; i++) {
        var spore = new Spore3d();

        s = tombola.rangeFloat(0.18,0.28);
        if (tombola.percent(2)) {
            s = tombola.rangeFloat(0.4,0.55);
        }

        geometry = sporeMesh(s);
        material = new materialType( { color: colToHex(spore.color) } );
        spore.mesh = new THREE.Mesh( geometry, material );
        meshRotate(spore.mesh);
        spore.obj = new THREE.Object3D();
        spore.obj.add( spore.mesh );
        bio.obj.add( spore.obj );

        spore.reset(this.spawn);
        spore.init();
        this.spores.push( spore );
    }


    // CREATE BEDS //
    for (i=0; i<5; i++) {

        s = tombola.rangeFloat(0.16,0.3);
        var bed = new Bed3d();

        geometry = multiHex(s);
        material = new materialType( { color: colToHex(new RGBA(255,140,110,1)) } );
        bed.mesh = new THREE.Mesh( geometry, material );
        meshRotate(bed.mesh);
        bed.obj = new THREE.Object3D();
        bed.obj.add( bed.mesh );
        bio.obj.add( bed.obj );

        bed.reset(this.spawn);
        bed.init();
        this.beds.push( bed );
    }

};


PinkSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===70) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn);
    }

    // BED //
    l = this.beds.length;
    for (i=0; i<l; i++) {
        this.beds[i].update(this.spawn);
    }
};


PinkSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.008;
};



//-------------------------------------------------------------------------------------------
//  MAGENTA SPORES
//-------------------------------------------------------------------------------------------


function MagentaSpores() {
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


MagentaSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<13; i++) {
        var pod = new Pod3d();
        s = tombola.rangeFloat(0.2,0.35);

        geometry = podMesh(s);

        //material = new materialType( { color: colToHex(pod.color) } );

        var top = new THREE.Color(colToHex(new RGBA(pod.color.R+50,pod.color.G+70,pod.color.B+60,1)));
        var side = new THREE.Color(colToHex(pod.color));

        material = new materialType( { vertexColors: THREE.VertexColors } );
        pod.mesh = new THREE.Mesh( geometry, material );
        for (var j=0; j<pod.mesh.geometry.faces.length; j++) {
            var f = pod.mesh.geometry.faces[j];
            f.vertexColors[0] = top;
            f.vertexColors[1] = side;
            f.vertexColors[2] = side;
        }



        pod.mesh = new THREE.Mesh( geometry, material );
        meshRotate(pod.mesh);
        pod.obj = new THREE.Object3D();
        pod.obj.add( pod.mesh );
        bio.obj.add( pod.obj );

        pod.reset(this.spawn);
        pod.init();
        this.spores.push( pod );
    }

};


MagentaSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===20) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn);
    }
};


MagentaSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.025;
};


//-------------------------------------------------------------------------------------------
//  BLACK SPORES
//-------------------------------------------------------------------------------------------


function BlackSpores() {
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


BlackSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<14; i++) {
        var pod = new Pod3d();

        s = tombola.rangeFloat(0.35,0.55);
        s = tombola.rangeFloat(0.2,0.25);
        geometry = podMesh(s);

        var b = tombola.range(40,170);
        var c = new RGBA(0,170,b,1);
        c = new RGBA(36,30,35);
        material = new materialType( { color: colToHex(c) } );
        pod.mesh = new THREE.Mesh( geometry, material );
        meshRotate(pod.mesh);
        pod.obj = new THREE.Object3D();
        pod.obj.add( pod.mesh );
        bio.obj.add( pod.obj );

        pod.reset(this.spawn);
        pod.init();
        this.spores.push( pod );
    }

};


BlackSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===25) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn);
    }
};


BlackSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.02;
};


//-------------------------------------------------------------------------------------------
//  SUSHI SPORES
//-------------------------------------------------------------------------------------------


function SushiSpores() {
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


SushiSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<4; i++) {
        var pod = new Sushi3d();

        s = tombola.rangeFloat(0.11,0.28);
        var d = tombola.rangeFloat(0.8,1.5);
        geometry = polyMesh(s,5,0.001,d);


        var top = new THREE.Color(colToHex(new RGBA(250,230,200,1)));
        var side = new THREE.Color(colToHex(new RGBA(80,40,45,1)));

        material = new materialType( { vertexColors: THREE.FaceColors } );
        pod.mesh = new THREE.Mesh( geometry, material );
        for (var j=0; j<pod.mesh.geometry.faces.length; j++) {
            var f = pod.mesh.geometry.faces[j];
            if (j===0 || j===3 || j===6 || j===9 || j===12 || j===15) {
                f.color = top;
            } else {
                f.color = side;
            }
        }

        var deg = TAU/360;
        pod.mesh.rotation.z = tombola.rangeFloat(-deg*20,deg*20);
        meshRotate(pod.mesh);
        pod.obj = new THREE.Object3D();
        pod.obj.add( pod.mesh );
        bio.obj.add( pod.obj );

        pod.reset(this.spawn);
        pod.init();
        this.spores.push( pod );
    }

};


SushiSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===200) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn,this.spores);
    }
};


SushiSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.004;
};


//-------------------------------------------------------------------------------------------
//  TUBE SPORES
//-------------------------------------------------------------------------------------------


function TubeSpores() {
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


TubeSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<16; i++) {
        var pod = new Tube3d();

        s = tombola.rangeFloat(0.04,0.05);
        geometry = tubeMesh(s);


        var top = new THREE.Color(colToHex(new RGBA(255,195,185,1)));
        var side = new THREE.Color(colToHex(new RGBA(190,50,130,1)));

        material = new materialType( { vertexColors: THREE.VertexColors } );
        pod.mesh = new THREE.Mesh( geometry, material );
        for (var j=0; j<pod.mesh.geometry.faces.length; j++) {
            var f = pod.mesh.geometry.faces[j];
            if (j>7) {
                f.vertexColors[0] = top;
                f.vertexColors[1] = top;
                f.vertexColors[2] = top;
            } else {
                if (j%2==0) {
                    f.vertexColors[0] = side;
                    f.vertexColors[1] = side;
                    f.vertexColors[2] = top;
                } else {
                    f.vertexColors[0] = side;
                    f.vertexColors[1] = top;
                    f.vertexColors[2] = top;
                }

            }
        }

        var deg = TAU/360;
        pod.mesh.rotation.z = tombola.rangeFloat(-deg*9,deg*9);
        meshRotate(pod.mesh);
        pod.obj = new THREE.Object3D();
        pod.obj.add( pod.mesh );
        bio.obj.add( pod.obj );

        pod.reset(this.spawn);
        pod.init();
        this.spores.push( pod );
    }

};


TubeSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===90) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn,this.spores);
    }
};


TubeSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.005;
};


//-------------------------------------------------------------------------------------------
//  SMALL TUBE SPORES
//-------------------------------------------------------------------------------------------


function SmallTubeSpores() {
    this.spores = [];
    this.spawnIndex = tombola.range(500,5000);
    this.spawn = new Point3D(0, 0, 0);
    this.counter = 0;
}


SmallTubeSpores.prototype.setup = function() {
    this.spawnWalk();
    var i,s,geometry,material;

    // CREATE SPORES //
    for (i=0; i<11; i++) {
        var pod = new Tube3d();

        s = tombola.rangeFloat(0.015,0.025);
        geometry = tubeMesh(s);


        var top = new THREE.Color(colToHex(new RGBA(250,230,200,1)));
        var side = new THREE.Color(colToHex(new RGBA(40,200,220,1)));

        material = new materialType( { vertexColors: THREE.VertexColors } );
        pod.mesh = new THREE.Mesh( geometry, material );
        for (var j=0; j<pod.mesh.geometry.faces.length; j++) {
            var f = pod.mesh.geometry.faces[j];
            if (j>7) {
                f.vertexColors[0] = top;
                f.vertexColors[1] = top;
                f.vertexColors[2] = top;
            } else {
                if (j%2==0) {
                    f.vertexColors[0] = side;
                    f.vertexColors[1] = side;
                    f.vertexColors[2] = top;
                } else {
                    f.vertexColors[0] = side;
                    f.vertexColors[1] = top;
                    f.vertexColors[2] = top;
                }

            }
        }

        var deg = TAU/360;
        pod.mesh.rotation.z = tombola.rangeFloat(-deg*9,deg*9);
        meshRotate(pod.mesh);
        pod.obj = new THREE.Object3D();
        pod.obj.add( pod.mesh );
        bio.obj.add( pod.obj );

        pod.reset(this.spawn);
        pod.init();
        this.spores.push( pod );
    }

};


SmallTubeSpores.prototype.update = function() {

    // spawn //
    this.counter ++;
    if (this.counter===100) {
        this.spawnWalk();
        this.counter = 0;
    }
    var l,i;

    // SPORES //
    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].update(this.spawn,this.spores);
    }
};


SmallTubeSpores.prototype.spawnWalk = function() {
    this.spawn.x = bio.simplex.noise(this.spawnIndex,0) * bio.size;
    this.spawn.z = bio.simplex.noise(0,this.spawnIndex) * bio.size;
    this.spawnIndex += 0.004;
};



//-------------------------------------------------------------------------------------------
//  GENERIC
//-------------------------------------------------------------------------------------------


function colToHex(col) {
    return "rgb(" + col.R + ',' + col.G + ',' + col.B + ')';
}

function meshRotate(mesh) {
    mesh.rotation.y = tombola.rangeFloat(0,TAU);
    meshUpdate(mesh);
}

function meshUpdate(mesh) {
    mesh.updateMatrix();
    mesh.geometry.applyMatrix( mesh.matrix );
    mesh.matrix.identity();
    mesh.position.set( 0, 0, 0 );
    mesh.rotation.set( 0, 0, 0 );
    mesh.scale.set( 1, 1, 1 );
}

function scale3D( obj, scale ) {
    obj.scale.x = scale;
    obj.scale.y = scale;
    obj.scale.z = scale;
}

function pointDistance(p1, p2) {
    return Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.z-p2.z)*(p1.z-p2.z) );
}