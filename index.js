const cameraBtn = document.getElementById("camera-btn");
const cameraStream = document.getElementById("camera-stream");
const err = document.getElementById("err");
const errorMsg = document.getElementById("error-msg");

function startStreaming() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        console.log("Web camera is on");
        // set the source of the video element to the stream from the camera
        cameraStream.srcObject = stream;
        // play the video
        cameraStream.play();
      })
      .catch(function(error) {
        console.log("Error occurred: " + error);
      });
  }

cameraBtn.addEventListener("click", function() {
  navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      var hasCamera = devices.some(function(device) {
        return device.kind === 'videoinput';
      });
      if(hasCamera){
        navigator.permissions.query({ name: 'camera' }).then(function(permissionStatus) {
          if(permissionStatus.state === 'granted'){
            startStreaming();
          } else if (permissionStatus.state === 'prompt') {
            permissionStatus.onchange = function() {
              if (permissionStatus.state === 'granted') {
                startStreaming();
              }
            }
            navigator.permissions.request({ name: 'camera' });
          } else {
            console.log("Permission denied for the camera");
            errorMsg.innerText = "Permission denied for the camera";
            const img = document.createElement('img');
            img.src="./turn-on-your-camera.png";
            document.getElementById('err').appendChild(img);
            // alert("Permission denied for the camera");
          }
        });
      } else {
        errorMsg.innerText = "Web camera is not available";
        console.log("Web camera is not available");
        // alert("Web camera is not available");
      }
    })
    .catch(function(error) {
      console.log("Error occurred: " + error);
    });
});