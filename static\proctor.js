const video = document.getElementById("video");
const alertBox = document.getElementById("alertBox");

let lastLight = null;

function showAlert(msg) {
  alertBox.innerText = "⚠️ " + msg;
  alertBox.style.display = "block";

  fetch("/alert", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      student: "Student 1",
      alert: msg
    })
  });
}

function hideAlert() {
  alertBox.style.display = "none";
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

function checkLighting() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += (data[i] + data[i+1] + data[i+2]) / 3;
  }
  const brightness = sum / (data.length / 4);

  if (lastLight && Math.abs(brightness - lastLight) > 40) {
    showAlert("Lighting changed");
  }

  lastLight = brightness;
}

async function loadModel() {
  return await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );
}

startCamera();

loadModel().then(model => {
  setInterval(async () => {
    const faces = await model.estimateFaces({ input: video });

    if (faces.length === 0) {
      showAlert("No face detected");
      return;
    }

    if (faces.length > 1) {
      showAlert("More than one face detected");
      return;
    }

    checkLighting();
    hideAlert();

  }, 2000);
});
