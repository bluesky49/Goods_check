
let stream = document.getElementById( "inputVideo" ),
    capture = document.createElement( "canvas" ),
    snapshot = document.createElement("div"),
    img = new Image();

snapshot.id = "snapshot";
snapshot.style.position = "absolute";
snapshot.style.width = "100%";
snapshot.style.height = "100%";
snapshot.style.left = "0px";
snapshot.style.top = "0px";
snapshot.style.overflow = "hidden";
snapshot.style.zIndex = 1;
snapshot.classList.add("hide");
document.getElementById("maincamera").appendChild(snapshot);

let cameraStream = null, global_random_qr_key;

function startStreaming() {
    let mediaSupport = 'mediaDevices' in navigator;
    if( mediaSupport && null == cameraStream ) {
        navigator.mediaDevices.getUserMedia( { video: { width: 300, height: 300*global_media_height/global_media_width } } )
        .then( function( mediaStream ) {
            cameraStream = mediaStream;
            stream.srcObject = mediaStream;
            console.log(typeof(mediaStream));
            stream.play();
        })
        .catch( function( err ) {
            show("nonecamera");
            console.log( "Unable to access camera: " + err );
        });
    }
    else {
        alert( 'Your browser does not support media devices.' );
        return;
    }
}

function stopStreaming() {
    if( null != cameraStream ) {
        let track = cameraStream.getTracks()[ 0 ];
        track.stop();
        stream.load();
        cameraStream = null;
    }
}

function captureSnapshot() {
    global_random_qr_key = cameraStream ? 
                           Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) :
                           "Nonecamera";
    if( null != cameraStream ) {
        let ctx = capture.getContext( '2d' );        
        ctx.drawImage( stream, 0, 0, capture.width, capture.height );    
        img.src            = capture.toDataURL( "image/png" );
        img.id             = global_random_qr_key;
        img.style.height   = "100%";
        img.style.width    = "100%";
        snapshot.innerHTML = '';
        snapshot.appendChild(img);
        show("snapshot");
        global_screen_url = capture.toDataURL( "image/png" );
        show("logo");
    }
}

function show(id) {
    document.getElementById(id).classList.remove("hide");
    document.getElementById(id).classList.add("show");
}

function hide(id) {
    document.getElementById(id).classList.remove("show");
    document.getElementById(id).classList.add("hide");
}

function removeSnapshot() {
    hide("snapshot");
    hide("logo");
}

function downSnapshot() {
    if(global_random_qr_key == "Nonecamera") {
        alert("Can't download screenshot, please check your camera.");
        return;
    }
    let a = document.createElement('a');
    a.href = img.src;
    a.download = global_random_qr_key + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

startStreaming();
