let stream = document.getElementById("inputVideo"),
  capture = document.createElement("canvas"),
  snapshot = document.createElement("div"),
  img = new Image();

snapshot.id = "snapshot";
snapshot.style.position = "absolute";
snapshot.style.overflow = "hidden";
snapshot.style.zIndex = 1;
snapshot.classList.add("hide");
document.getElementById("maincamera").appendChild(snapshot);

let cameraStream = null, global_random_qr_key;

function startStreaming(w, h) {
  let mediaSupport = 'mediaDevices' in navigator;
  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices.getUserMedia({
      video: true
    })
      .then(function (mediaStream) {
        cameraStream = mediaStream;
        stream.srcObject = mediaStream;
        stream.play();
      })
      .catch(function (err) {
        show("nonecamera");
        console.log("Unable to access camera: " + err);
      });
  } else {
    alert('Your browser does not support media devices.');
    return;
  }
}

function stopStreaming() {
  if (null != cameraStream) {
    let track = cameraStream.getTracks()[0];
    track.stop();
    stream.load();
    cameraStream = null;
  }
}

function captureSnapshot() {
  global_random_qr_key = cameraStream ?
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) :
    "Nonecamera";
  
  if (null != cameraStream) {
    let ctx = capture.getContext('2d'), wh, ht, ratio;
    ratio = stream.videoWidth / stream.videoHeight;
    wh = global_media_width;
    ht = global_media_height;
    let delta = (ht * ratio - wh) / 2;
    if(ht * ratio >= wh) {
        capture.width = ht * ratio;
        capture.height = ht;
        ctx.fillRect(-delta, 0, ht * ratio, ht);
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(stream, -ht * ratio, 0, ht * ratio, ht);
        ctx.drawImage(document.getElementById("logoimg"), -(capture.width - 10), 10, 50, 50);
        ctx.restore();
        snapshot.innerHTML = '';
        snapshot.appendChild(capture);
        snapshot.style.left = -delta + "px";
        snapshot.style.top = "0px";
        snapshot.style.width = ht * ratio + "px";
        snapshot.style.height = "100%";
    } else {
        capture.width = wh;
        capture.height = wh / ratio;
        delta = (wh / ratio - ht) / 2;
        ctx.fillRect(0, -delta, capture.width, capture.height);  
        ctx.save();
        ctx.scale(-1,1);
        ctx.drawImage(stream, -capture.width, 0, capture.width, capture.height);
        ctx.drawImage(document.getElementById("logoimg"), -(capture.width - 10), 10, 50, 50);
        ctx.restore();
        snapshot.innerHTML = '';
        snapshot.appendChild(capture);
        snapshot.style.left = "0px";
        snapshot.style.top = -delta + "px";
        snapshot.style.width = wh + "px";
        snapshot.style.height = capture.height - delta + "px";
    }
    show("snapshot");
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
  if(!cameraStream) {
    return;
  }
  let a = document.createElement('a');
  a.href = capture.toDataURL('image/jpg');
  a.download = "snapshot.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
