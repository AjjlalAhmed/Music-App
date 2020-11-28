//Adding controls functionality
(() => {
  //adding play and pause functionality
  const playBtn = document.querySelector(".play-pause_btn");
  const audio = document.querySelector("audio");
  audio.volume = 0.3;
  let play = false;
  playBtn.addEventListener("click", () => {
    if (play === false) {
      audio.play();
      playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
      play = true;
    } else {
      audio.pause();
      playBtn.innerHTML = `<i class="fa fa-play" aria-hidden="true"></i>`;
      play = false;
    }
  });
  // adding next and previous funtionality
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  let songSre = [
    "mixkit-hazy-after-hours-132.mp3",
    "mixkit-hip-hop-02-738.mp3",
    "mixkit-raising-me-higher-34.mp3",
    "mixkit-tech-house-vibes-130.mp3",
  ];
  let songCount = 0;
  nextBtn.addEventListener("click", () => {
    nextSong();
  });
 async function nextSong() {
    songCount++;
    if (songCount > 3) songCount = 0;
   await audio.setAttribute("src", `audio/${songSre[songCount]}`);
   await audio.pause();
   await audio.play();
    playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
    play = true;
  }
  prevBtn.addEventListener("click", () => {
    prevSong();
  });
  async function prevSong() {
    songCount--;
    if (songCount < 0) songCount = songSre.length - 1;
   await audio.setAttribute("src", `audio/${songSre[songCount]}`);
   await audio.pause();
   await audio.play();
    playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
    play = true;
  }
  // adding volume functionality
  const volumeBar = document.querySelector("#volume");
  volumeBar.oninput = (e) => {
    let volumeNum = eval(volumeBar.value / 100);
    audio.volume = volumeNum;
    x = volumeBar.value;
    color =
      "linear-gradient(90deg, rgb(255,255,255)" +
      x +
      "% , rgb(177, 169, 169)" +
      x +
      "%)";
    volumeBar.style.background = color;
  };
  //   adding progressBar functionality
  const progressBar = document.querySelector("#progress-bar");
  progressBar.oninput = () => {
    x = progressBar.value;
    color =
      "linear-gradient(90deg, rgb(255,255,255)" +
      x +
      "% , rgb(177, 169, 169)" +
      x +
      "%)";
    progressBar.style.background = color;
  };
  audio.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    const progress = document.querySelector("#proress-bar");
    progressBar.setAttribute("max", duration);
    progressBar.value = currentTime;
    x = eval(`${currentTime}*100/${duration}`);
    color =
      "linear-gradient(90deg, rgb(255,255,255)" +
      x +
      "% , rgb(177, 169, 169)" +
      x +
      "%)";
    progressBar.style.background = color;
    progressBar.oninput = () => {
      audio.currentTime = progressBar.value;
    };
  });
  // Creating visualizer
  const context = new AudioContext();
  const analyserNode = new AnalyserNode(context, { fftSize: 128 });
  setupContext();
  drawAnimation();
  resize();
  async function setupContext() {
    const source = context.createMediaElementSource(audio);
    source.connect(analyserNode).connect(context.destination);
  }
  document.querySelector("button").addEventListener("click", function () {
    context.resume();
  });
  function drawAnimation() {
    requestAnimationFrame(drawAnimation);

    const bufferLenght = analyserNode.frequencyBinCount;
    const dataArry = new Uint8Array(bufferLenght);
    analyserNode.getByteFrequencyData(dataArry);
    const width = visualizer.width;
    const height = visualizer.height;
    const barWidth = width / bufferLenght;
    const canvasContext = visualizer.getContext("2d");
    canvasContext.clearRect(0, 0, width, height);
    dataArry.forEach((item, index) => {
      const y = ((item / 255) * height) / 1.5;
      const x = barWidth * index;
      canvasContext.fillStyle = `#4BB543`;
      canvasContext.fillRect(x, height - y, barWidth, y);
    });
  }
  function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio;
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio;
  }
})();
