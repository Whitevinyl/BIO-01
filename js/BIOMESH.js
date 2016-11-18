function sporeMesh(s) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(  0,     tombola.rangeFloat(s/2,s*1.5),  0    ),
        new THREE.Vector3( -s*0.5, 0,  s*0.2),
        new THREE.Vector3(  s*0.5, 0,  s*0.2),
        new THREE.Vector3(  0,     0, -s*0.6),
        new THREE.Vector3(  0,     0,  0    )
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
    geometry.faces.push( new THREE.Face3( 0, 3, 1 ) );

    geometry.faces.push( new THREE.Face3( 4, 2, 1 ) );
    geometry.faces.push( new THREE.Face3( 4, 3, 2 ) );
    geometry.faces.push( new THREE.Face3( 4, 1, 3 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}

function podMesh(s) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(  0,     tombola.rangeFloat(s/2,s*1.5),  0    ),
        new THREE.Vector3( -s*0.5, 0,  s*0.2),
        new THREE.Vector3(  s*0.5, 0,  s*0.2),
        new THREE.Vector3(  0,     0, -s*0.6)
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
    geometry.faces.push( new THREE.Face3( 0, 3, 1 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}


function quadMesh(s,h) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(  0,   tombola.rangeFloat(0.5,1),  0),
        new THREE.Vector3(  0,   0,  1),
        new THREE.Vector3( -0.5, 0,  0),
        new THREE.Vector3(  0,   0, -1),
        new THREE.Vector3(  0.5, 0,  0)
    );

    // scale //
    for (var i=0; i<geometry.vertices.length; i++) {
        geometry.vertices[i].multiply(new THREE.Vector3(s, h, s));
    }

    geometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
    geometry.faces.push( new THREE.Face3( 0, 3, 2 ) );
    geometry.faces.push( new THREE.Face3( 0, 4, 3 ) );
    geometry.faces.push( new THREE.Face3( 0, 1, 4 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}



function polyMesh(s,sides,h,d) {

    var geometry = new THREE.Geometry();
    var i;

    geometry.vertices.push( new THREE.Vector3(  0,   tombola.rangeFloat(h/2,h),  0) );

    for (i=1; i<=sides; i++) {
        geometry.vertices.push( new THREE.Vector3(Math.cos(i * 2 * Math.PI / sides), 0, Math.sin(i * 2 * Math.PI / sides)) );
    }

    if (d) {
        // raise existing vertices by depth //
        for (i=0; i<geometry.vertices.length; i++) {
            geometry.vertices[i].add(new THREE.Vector3(0, d, 0));
        }

        // add extra layer //
        for (i=1; i<=sides; i++) {
            geometry.vertices.push( new THREE.Vector3(Math.cos(i * 2 * Math.PI / sides), 0, Math.sin(i * 2 * Math.PI / sides)) );
        }
    }


    // scale //
    for (i=0; i<geometry.vertices.length; i++) {
        geometry.vertices[i].multiply(new THREE.Vector3(s, s, s));
    }


    for (i=0; i<=sides; i++) {
        var next = i+1;
        if (next>sides) {
            next = 1;
        }
        geometry.faces.push( new THREE.Face3( 0, next, i ) ); // top
        geometry.faces.push( new THREE.Face3( i+sides, i, next ) ); // side a
        geometry.faces.push( new THREE.Face3( i+sides, next, next+sides ) ); // side b
    }

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}



function dustMesh(s) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( -s*0.5, 0,  s*0.2),
        new THREE.Vector3(  s*0.5, 0,  s*0.2),
        new THREE.Vector3(  0,     0, -s*0.6)
    );
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}



function bedMesh(s) {
    var geometry = new THREE.Geometry();
    var b = -0.02;

    if (tombola.percent(20)) {
        // TRI //
        geometry.vertices.push(
            new THREE.Vector3(  0,     tombola.rangeFloat(0.01,0.05),  0    ),
            new THREE.Vector3( -s*0.5, b,  s*0.2),
            new THREE.Vector3(  s*0.5, b,  s*0.2),
            new THREE.Vector3(  0,     b, -tombola.rangeFloat(s*0.3,s*0.6))
        );

        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
        geometry.faces.push( new THREE.Face3( 0, 3, 1 ) );
    }
    else {
        // QUAD //
        geometry.vertices.push(
            new THREE.Vector3(  0,     tombola.rangeFloat(s*0.01,s*0.15),  0    ),

            new THREE.Vector3( -tombola.rangeFloat(s*0.1,s*0.5), b,  -tombola.rangeFloat(s*0.1,s*0.5)),
            new THREE.Vector3( -tombola.rangeFloat(s*0.1,s*0.5), b,   tombola.rangeFloat(s*0.1,s*0.5)),
            new THREE.Vector3(  tombola.rangeFloat(s*0.1,s*0.5), b,   tombola.rangeFloat(s*0.1,s*0.5)),
            new THREE.Vector3(  tombola.rangeFloat(s*0.1,s*0.5), b,  -tombola.rangeFloat(s*0.1,s*0.5))
        );

        geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
        geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
        geometry.faces.push( new THREE.Face3( 0, 3, 4 ) );
        geometry.faces.push( new THREE.Face3( 0, 4, 1 ) );
    }

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}


function rockMesh(s) {

    var range = 1.2;
    var h = s * tombola.rangeFloat(0.9,2);
    var xOff = s * tombola.rangeFloat(-0.6,0.6);
    var zOff = s * tombola.rangeFloat(0,0.8);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(

        new THREE.Vector3( (-s)+fluct(s*0.06),      0,    (s*0.3)+fluct(s*0.06)), // tl

        new THREE.Vector3(  (0)+fluct(s*0.06),      0,    (s*0.5)+fluct(s*0.08)),

        new THREE.Vector3(  (s)+fluct(s*0.06),      0,    (s*0.3)+fluct(s*0.06)),

        new THREE.Vector3(  (s)+fluct(s*0.06),      0,   (-s*0.3)+fluct(s*0.06)),

        new THREE.Vector3(  (0)+fluct(s*0.06),      0,   (-s*0.5)+fluct(s*0.08)),

        new THREE.Vector3( (-s)+fluct(s*0.06),      0,   (-s*0.3)+fluct(s*0.06)), // bl



        new THREE.Vector3(  (-s*0.7)+xOff+fluct(s*0.06),  h+fluct(s*0.3),    (s*0.2)+zOff+fluct(s*0.04)),

        new THREE.Vector3(   (s*0.7)+xOff+fluct(s*0.06),  h+fluct(s*0.3),    (s*0.2)+zOff+fluct(s*0.04)),

        new THREE.Vector3(   (s*0.7)+xOff+fluct(s*0.06),  h+fluct(s*0.3),   (-s*0.2)+zOff+fluct(s*0.04)),

        new THREE.Vector3(  (-s*0.7)+xOff+fluct(s*0.06),  h+fluct(s*0.3),   (-s*0.2)+zOff+fluct(s*0.04))


    );

    geometry.faces.push( new THREE.Face3( 1, 6, 0 ) );
    geometry.faces.push( new THREE.Face3( 6, 1, 7 ) );
    geometry.faces.push( new THREE.Face3( 2, 7, 1 ) );

    geometry.faces.push( new THREE.Face3( 3, 7, 2 ) );
    geometry.faces.push( new THREE.Face3( 7, 3, 8 ) );

    geometry.faces.push( new THREE.Face3( 8, 3, 4 ) );
    geometry.faces.push( new THREE.Face3( 8, 4, 9 ) );
    geometry.faces.push( new THREE.Face3( 9, 4, 5 ) );

    geometry.faces.push( new THREE.Face3( 6, 9, 5 ) );
    geometry.faces.push( new THREE.Face3( 6, 5, 0 ) );

    geometry.faces.push( new THREE.Face3( 6, 7, 8 ) );
    geometry.faces.push( new THREE.Face3( 6, 8, 9 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}


function tubeMesh(s) {

    var h = s * tombola.rangeFloat(3,11);
    var xOff = s * tombola.rangeFloat(-0.3,0.3);
    var zOff = s * tombola.rangeFloat(-0.3,0.3);
    var v = s * 0.04;

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3( (-s)+fluct(v),      0,    (s)+fluct(v)),
        new THREE.Vector3(  (s)+fluct(v),      0,    (s)+fluct(v)),
        new THREE.Vector3(  (s)+fluct(v),      0,   (-s)+fluct(v)),
        new THREE.Vector3( (-s)+fluct(v),      0,   (-s)+fluct(v)),

        new THREE.Vector3(  (-s)+xOff+fluct(v),  h+fluct(v),    (s)+zOff+fluct(v)),
        new THREE.Vector3(   (s)+xOff+fluct(v),  h+fluct(v),    (s)+zOff+fluct(v)),
        new THREE.Vector3(   (s)+xOff+fluct(v),  h+fluct(v),   (-s)+zOff+fluct(v)),
        new THREE.Vector3(  (-s)+xOff+fluct(v),  h+fluct(v),   (-s)+zOff+fluct(v))
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 4 ) );
    geometry.faces.push( new THREE.Face3( 1, 5, 4 ) );

    geometry.faces.push( new THREE.Face3( 1, 2, 5 ) );
    geometry.faces.push( new THREE.Face3( 2, 6, 5 ) );

    geometry.faces.push( new THREE.Face3( 2, 3, 6 ) );
    geometry.faces.push( new THREE.Face3( 3, 7, 6 ) );

    geometry.faces.push( new THREE.Face3( 3, 0, 7 ) );
    geometry.faces.push( new THREE.Face3( 0, 4, 7 ) );

    geometry.faces.push( new THREE.Face3( 4, 5, 6 ) );
    geometry.faces.push( new THREE.Face3( 4, 6, 7 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}



function hexMesh(s) {

    var range = 1.2;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(

        new THREE.Vector3(  0,      0,    0), // center

        new THREE.Vector3(  0,      0,    s),

        new THREE.Vector3( -s*0.8,  0,    s*0.5),

        new THREE.Vector3( -s*0.8,  0,   -s*0.5),

        new THREE.Vector3(  0,      0,   -s),

        new THREE.Vector3(  s*0.8,  0,   -s*0.5),

        new THREE.Vector3(  s*0.8,  0,    s*0.5)


    );

    geometry.faces.push( new THREE.Face3( 1, 0, 2 ) );
    geometry.faces.push( new THREE.Face3( 2, 0, 3 ) );
    geometry.faces.push( new THREE.Face3( 3, 0, 4 ) );
    geometry.faces.push( new THREE.Face3( 4, 0, 5 ) );
    geometry.faces.push( new THREE.Face3( 5, 0, 6 ) );
    geometry.faces.push( new THREE.Face3( 6, 0, 1 ) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}

function hexMesh2(s) {

    var geometry = new THREE.Geometry();

    var angle = 1.7320508075688767;
    var h = angle * 0.5;
    geometry.vertices.concat(hexVertices(h));


    // scale //
    for (var i=0; i<geometry.vertices.length; i++) {
        geometry.vertices[i].multiply(new THREE.Vector3(s, 1, s));
    }

    geometry.faces.push(new THREE.Face3( 0, 1, 2) );
    geometry.faces.push(new THREE.Face3( 0, 2, 3) );
    geometry.faces.push(new THREE.Face3( 0, 3, 4) );
    geometry.faces.push(new THREE.Face3( 0, 4, 5) );
    geometry.faces.push(new THREE.Face3( 0, 5, 6) );
    geometry.faces.push(new THREE.Face3( 0, 6, 1) );

    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;
}

function hexVertices(h,offset) {
    var vertices = [];
    vertices.push(new THREE.Vector3(0,  0, 0   ) );
    vertices.push(new THREE.Vector3(0,  0, 1   ) );
    vertices.push(new THREE.Vector3(-h, 0, 0.5 ) );
    vertices.push(new THREE.Vector3(-h, 0, -0.5) );
    vertices.push(new THREE.Vector3(0,  0, -1  ) );
    vertices.push(new THREE.Vector3(h,  0, -0.5) );
    vertices.push(new THREE.Vector3(h,  0, 0.5 ) );

    for (var i=0; i<vertices.length; i++) {
        if (offset) {
            vertices[i].add(offset);
        }
    }
    return vertices;
}



function multiHex(s) {
    var geometry = new THREE.Geometry();

    var angle = 1.7320508075688767;
    var h = angle * 0.5;
    var i;

    var offsets = [
        new THREE.Vector3(-h, 0, 0), // l
        new THREE.Vector3(0, 0, 1.5), // t
        new THREE.Vector3(h, 0, 0), // r
        new THREE.Vector3(0, 0, -1.5) // b
    ];

    // add vertices //
    for (i=0; i<offsets.length; i++) {
        geometry.vertices = geometry.vertices.concat(hexVertices(h,offsets[i]));
    }

    // scale //
    for (i=0; i<geometry.vertices.length; i++) {
        geometry.vertices[i].multiply(new THREE.Vector3(s, 1, s));
    }

    // add faces //
    for (i=0; i<offsets.length; i++) {
        var ind = 7*i;
        geometry.faces.push(new THREE.Face3(ind, ind+2, ind+1));
        geometry.faces.push(new THREE.Face3(ind, ind+3, ind+2));
        geometry.faces.push(new THREE.Face3(ind, ind+4, ind+3));
        geometry.faces.push(new THREE.Face3(ind, ind+5, ind+4));
        geometry.faces.push(new THREE.Face3(ind, ind+6, ind+5));
        geometry.faces.push(new THREE.Face3(ind, ind+1, ind+6));
    }

    geometry.mergeVertices();
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    return geometry;

}



function fluct(a) {
    return tombola.rangeFloat(-a,a);
}