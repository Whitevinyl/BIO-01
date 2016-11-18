/**
 * Created by luketwyman on 03/11/2014.
 */



// INIT //
var canvas;
var cxa;
var scene = 0;
var TWEEN;
var stats;

// METRICS //
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";

var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;


// COLORS //
var bgCols = [new RGBA(33,17,33,1),new RGBA(28,20,25,1),new RGBA(28,18,28,1),new RGBA(255, 165, 130,1),new RGBA(255, 165, 130,1)];
var cols = [new RGBA(255,255,255,1), new RGBA(0,226,186,1), new RGBA(255,131,125,1), new RGBA(50,200,160,1), new RGBA(15,215,175,1), new RGBA(10,212,172,1), new RGBA(255, 250, 150,1)];
var rockCols = [new RGBA(110,105,110,1),new RGBA(110,105,110,1),new RGBA(40,35,40,1)];

var bgCol = bgCols[2];
var hCol = cols[5];

var colMode = 1;

if (colMode===1) {
    bgCol = bgCols[3];
    hCol = cols[6];
}


var bio;
var scene3d,camera3d,renderer3d,directional3d,ambient3d,col3d,rockMat3d;
var updateCols = false;
var day = false;


//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    ////////////// SETUP CANVAS ////////////

    canvas = document.getElementById("cnvs");
    cxa = canvas.getContext("2d");
    cxa.mozImageSmoothingEnabled = false;
    cxa.imageSmoothingEnabled = false;

    initInteraction(canvas);

    init3D();


    // SET CANVAS & DRAWING POSITIONS //
    metrics();


    // AUDIO //
    initAudio();


    bio = new Bio3d();
    bio.setup();



    setTimeout( function() {
        colourTo(color.master,5,0,5,0,4);
    },10);


    setDayNight();
    startDayNight(3,30);


    // STATS //
    initStats();


    // DONE //
    draw();
} // END INIT



function init3D() {

    scene3d = new THREE.Scene();
    camera3d = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 50 );

    renderer3d = new THREE.WebGLRenderer({antialias: true});
    renderer3d.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer3d.domElement );



    camera3d.position.z = 7.1;
    camera3d.position.y = 3.8;
    camera3d.rotation.x = -((TAU/360)*28);


    col3d = new THREE.Color( colToHex(bgCols[3]) );
    scene3d.background = col3d;
    scene3d.fog = new THREE.Fog(col3d,6,13);


}

function update3DCols() {
    if (updateCols) {
        col3d = new THREE.Color( colToHex(bgCols[3]) );

        scene3d.background = col3d;
        scene3d.fog.color = col3d;
        bio.terrain.material.color = col3d;


        rockMat3d.color = new THREE.Color( colToHex(rockCols[0]) );

        updateCols = false;
    }
}


function initStats() {
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}



//-------------------------------------------------------------------------------------------
//  LOOP
//-------------------------------------------------------------------------------------------




function draw() {
    stats.begin();
    update();
    drawBG();
    drawScene();
    stats.end();

    requestAnimationFrame(draw);
}


function startDayNight(d,i) {
    setTimeout( function() {
        dayNight();
        setInterval(dayNight,i*1000);
    },d * 1000);
}

function dayNight() {
    if (day) {
        colorToColor(bgCols[3],bgCols[0],4);
        colorToColor(rockCols[0],rockCols[2],4);
        day = false;
    }
    else {
        colorToColor(bgCols[3],bgCols[4],4);
        colorToColor(rockCols[0],rockCols[1],4);
        day = true;
    }
}

function setDayNight() {
    if (day) {
        bgCols[3] = bgCols[4].clone();
        rockCols[0] = rockCols[1].clone();
    }
    else {
        bgCols[3] = bgCols[0].clone();
        rockCols[0] = rockCols[2].clone();
    }
    updateCols = true;
}



//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------



function update() {
    if (TWEEN) {
        TWEEN.update();
    }
    bio.update();

    if (renderer3d) {
        renderer3d.render( scene3d, camera3d );
    }
}




function valueInRange(value,floor,ceiling) {
    if (value < floor) {
        value = floor;
    }
    if (value> ceiling) {
        value = ceiling;
    }
    return value;
}

function lerp(current,destination,speed) {
    return current + (((destination-current)/100) * speed);
}




//-------------------------------------------------------------------------------------------
//  RESIZE
//-------------------------------------------------------------------------------------------


function resize() {
    metrics();
    bio.resize();
    //landscapeBackground.resize();
}
