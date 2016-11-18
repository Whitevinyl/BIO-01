var audioContext;

function initAudio() {

    audioContext = new AudioContext();

    StartAudioContext(audioContext, '#cnvs', function(){
        //audio context is started
        console.log('audio');
    });

}
