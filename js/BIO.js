

function Bio(pos) {
    this.pos = pos || new Point(0,0);
    this.spores = [];
    this.simplex = new SimplexNoise();
    this.spawn = new Point(0,0);
    this.spawnIndex = new Vector(5,5);
    this.points = [];
}


Bio.prototype.setup = function() {

    this.pos.x = dx;
    this.pos.y = dy;

    this.spawnWalk();

    // create spores //
    for (var i=0; i<200; i++) {

        var pos = new Point(0,0);
        var points = [
            new Point(tombola.rangeFloat(-6,-2),0),
            new Point(0,tombola.rangeFloat(-5,-12)),
            new Point(tombola.rangeFloat(2,6),0),
            new Point(0,tombola.rangeFloat(0.5,1.5))
        ];
        var speed = new Vector(0,0);

        var spore = new Spore(pos,points,speed);
        spore.reset(this.spawn);
        grow(spore);

        this.spores.push( spore );
    }

    this.updatePoints();

};

Bio.prototype.updatePoints = function() {
    this.points = [];
    var nx,ny,n,n2,w;
    var d = 10;
    n2 = 10/d;
    w = 0.03;
    for (var i=0; i<20; i++) {
        n = i/d;

        if (i<10) {
            nx = this.simplex.noise(this.spawnIndex.x + n - n2 - w,0);
            ny = this.simplex.noise(0,this.spawnIndex.y + n - n2);

        } else {
            nx = this.simplex.noise(this.spawnIndex.x + ((19/d)-n) - n2 + w,0);
            ny = this.simplex.noise(0,this.spawnIndex.y + ((19/d)-n) - n2);
        }

        this.points.push( new Point(nx * (200 * units),(50*units) + (ny * (100*units))));
    }
};


function grow(spore) {
    var s = 3;
    if (tombola.percent(3)) {
        for (var i=0; i<spore.points.length; i++) {
            spore.points[i].x *= s;
            spore.points[i].y *= s;
        }
    }
}


Bio.prototype.resize = function() {
    this.pos.x = dx;
    this.pos.y = dy;
};


Bio.prototype.update = function() {

    this.updatePoints();

    // SPAWN //
    this.spawnWalk();


    // SPORES //
    var l = this.spores.length;
    for (var i=0; i<l; i++) {
        this.spores[i].update(this.spawn);
    }
};

Bio.prototype.spawnWalk = function() {
    var nx = this.simplex.noise(this.spawnIndex.x,0);
    var ny = this.simplex.noise(0,this.spawnIndex.y);

    this.spawn.x = nx * (200 * units);
    this.spawn.y = (50*units) + (ny * (100 * units));

    var s = 0.0001;
    this.spawnIndex.x += s;
    this.spawnIndex.y += s;
};


Bio.prototype.draw = function() {


    var x = this.pos.x;
    var y = this.pos.y;
    var p = this.points;
    var u = units;
    var l = p.length;
    var ctx = cxa;

    color.fill(cxa,cols[0]);

    ctx.fillRect(this.pos.x + this.spawn.x - (5*units),this.pos.y + this.spawn.y - (5*units), 10*units, 10*units );

    ctx.beginPath();
    ctx.moveTo(x + (p[0].x * u), y + (p[0].y * u));
    for (var i=1; i<l; i++) {
        ctx.lineTo(x + (p[i].x * u), y + (p[i].y * u));
    }
    ctx.closePath();
    ctx.fill();


    l = this.spores.length;
    for (i=0; i<l; i++) {
        this.spores[i].draw(cxa,this.pos);
    }

};


function Spore(pos,points,speed) {
    this.pos = pos || new Point(0,0);
    this.offset = new Point(0,0);
    this.points = points || [];
    this.speed = speed || new Vector(0,-0.1);
    this.scale = 1;
    this.age = 10;
    var b = tombola.range(20,120);
    this.color = new RGBA(255,tombola.range(b+5,b+35),b,1);
    this.visible = false;
}


Spore.prototype.reset = function(spawn) {
    if (this.offset.y<0) {
        this.visible = true;
    }
    this.scale = 0;
    this.pos = new Point(spawn.x + tombola.range(-50,50),spawn.y + tombola.range(-20,20));
    this.offset = new Point(0,0);
    this.speed = new Vector(0,tombola.rangeFloat(-0.01,-0.1));
    var s = 60;
    this.age = tombola.range(s*10,s*35);

    sortZ(bio.spores);
};


Spore.prototype.update = function(spawn) {

    if (this.age<1) {
        this.speed.y *= 1.03;
        this.offset.y += this.speed.y;
    } else {
        this.age -= 1;
    }

    if (this.scale < 1) {
        this.scale = lerp(this.scale,1,2);
    }

    if (this.offset.y < -fullY) {
        this.reset(spawn);
    }

};



Spore.prototype.draw = function(ctx,origin) {
    if (this.visible) {

        var x = origin.x + this.pos.x;
        var y = origin.y + this.pos.y + this.offset.y;
        var p = this.points;
        var u = units * this.scale;
        var l = p.length;

        color.fill(ctx,this.color);

        ctx.beginPath();
        ctx.moveTo(x + (p[0].x * u), y + (p[0].y * u));
        for (var i=1; i<l; i++) {
            var h = 0;
            if (i===3) {
                h = -(this.speed.y*4);
            }
            ctx.lineTo(x + (p[i].x * u), y + ((p[i].y + h) * u));
        }
        ctx.closePath();
        ctx.fill();
    }

};


function comp(a,b) {
    if (a.pos.y < b.pos.y) {
        return -1;
    }
    return 1;
}

function sortZ(array) {
    array.sort(comp);
}
