//Adding controls functionality
(() => {
  const playBtn = document.querySelector(".play-pause_btn");
  const audio = document.querySelector("audio");
  // Creating dynamic song name
  const songNameContainer = document.querySelector("#song-name");
  let marquee = document.createElement("marquee");
  let audioSrcMarquee = audio.src.match("mixkit-hazy-after-hours-132.mp3");
  marquee.innerText = audioSrcMarquee[0];
  marquee.style.textTransform = "uppercase";
  marquee.style.padding = "10px";
  marquee.style.color = "#fff";
  songNameContainer.append(marquee);
  let play = false;
  function playAndPause() {
    if (play === false) {
      audio.play().then(async () => {
        if (context.state == "suspended") {
          await context.resume();
          playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
          play = true;
        } else {
          playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
          play = true;
        }
      });
    } else {
      audio.pause();
      audio.play().then(async () => {
        if (context.state == "suspended") {
          await context.resume();
          playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
          play = true;
        } else {
          playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
          play = true;
        }
      });
    }
  }
  function onload() {
    let db = new Localbase("db");
    db.collection("songs")
      .get()
      .then((songs) => {
        songs.forEach((song, index) => {
          if (index != 0) {
            songList.push(song.name);
          }
        });
        let screen = document.querySelector("#song-option");
        let ul = document.createElement("ul");
        songList.forEach((song, index) => {
          let li = document.createElement("li");
          li.textContent = song;
          let removeBtn = document.createElement("button");
          removeBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
          ul.append(li);
          ul.append(removeBtn);
          removeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            db.collection("songs")
              .doc({ name: song })
              .delete()
              .then((e) => {
                console.log("delete");
              })
              .catch((e) => {});

            delete songList[index];

            songList.pop();

            removeBtn.previousElementSibling.remove();
            removeBtn.remove();
          });
          li.addEventListener("click", (e) => {
            audio.setAttribute("src", `audio/${e.target.textContent}`);
            marquee.textContent = e.target.textContent;
            songs.forEach((song, index) => {
              if (e.target.innerHTML.includes(song.name)) {
                audio.setAttribute("src", song.data);
              }
            });
            playAndPause();
          });
        });
        screen.append(ul);
      });
  }
  // Play and pause buttons functionality
  playBtn.addEventListener("click", () => {
    if (play === false) {
      audio.play();
      playBtn.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`;
      marquee.start();
      play = true;
    } else {
      audio.pause();
      playBtn.innerHTML = `<i class="fa fa-play" aria-hidden="true"></i>`;
      marquee.stop();
      play = false;
    }
  });
  // adding next and previous funtionality
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  let songList = [
    "mixkit-hazy-after-hours-132.mp3",
    "mixkit-hip-hop-02-738.mp3",
    "mixkit-raising-me-higher-34.mp3",
    "mixkit-tech-house-vibes-130.mp3",
  ];
  // On load storing song data into song list
  window.onload = () => {
    onload();
  };
  let songCount = 0;
  // Next button event
  nextBtn.addEventListener("click", () => {
    nextSong();
  });
  function nextSong() {
    songCount++;
    if (songCount > songList.length - 1) songCount = 0;
    let db = new Localbase("db");
    db.collection("songs")
      .get()
      .then((songs) => {
        audio.setAttribute("src", `audio/${songList[songCount]}`);
        songs.forEach((song, index) => {
          if (song.name.includes(songList[songCount])) {
            audio.setAttribute("src", song.data);
          }
        });
        songNameContainer.innerHTML = "";
        marquee.innerText = songList[songCount];
        songNameContainer.append(marquee);
        playAndPause();
      });
  }
  // Prev button event
  prevBtn.addEventListener("click", () => {
    prevSong();
  });
  function prevSong() {
    songCount--;
    if (songCount < 0) songCount = songList.length - 2;
    let db = new Localbase("db");
    db.collection("songs")
      .get()
      .then((songs) => {
        audio.setAttribute("src", `audio/${songList[songCount]}`);
        songs.forEach((song, index) => {
          if (song.name.includes(songList[songCount])) {
            audio.setAttribute("src", song.data);
          }
        });
        songNameContainer.innerHTML = "";
        marquee.textContent = songList[songCount];
        songNameContainer.append(marquee);
        playAndPause();
      });
  }
  // Adding volume functionality
  const volumeBar = document.querySelector("#volume");
  audio.volume = 0.3;
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
  // Adding progressBar functionality
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
    if (currentTime == duration) {
      nextSong();
    }
  });
  // Creating visualizer
  const context = new AudioContext();
  const analyserNode = new AnalyserNode(context, { fftSize: 64 });
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
      const y = ((item / 255) * height) / 1.2;
      const x = barWidth * index;
      canvasContext.fillStyle = `hsl(${index * 8},100%,50%)`;
      canvasContext.fillRect(x, height - y, barWidth, y);
    });
  }
  function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio;
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio;
  }
  // Creating filereaders
  const inpFile = document.querySelector("#song-file");
  inpFile.addEventListener("change", async () => {
    let db = new Localbase("db");
    db.collection("songs")
      .get()
      .then(async (song) => {
        if (song.length == 0) {
          await db.collection("songs").add({
            name: "yes",
            data: "no",
          });
        }
        let songName = await db
          .collection("songs")
          .doc({ name: inpFile.files[0].name })
          .get()
          .then((song) => {
            if (typeof song !== "undefined") {
              audio.setAttribute("src", song.data);
              marquee.textContent = inpFile.files[0].name;
              inpFile.value = null;
              playAndPause();
              return;
            } else {
              const fileReader = new FileReader();
              fileReader.readAsDataURL(inpFile.files[0]);
              fileReader.onload = (e) => {
                audio.setAttribute("src", e.currentTarget.result);
                songList.push(inpFile.files[0].name);
                playAndPause();
                db.collection("songs").add({
                  name: inpFile.files[0].name,
                  data: e.currentTarget.result,
                });
                let screen = document.querySelector("#song-option");
                let ul = document.createElement("ul");
                screen.innerHTML = "";
                screen.append(ul);
                songList.forEach((song, index) => {
                  let li = document.createElement("li");
                  li.textContent = song;
                  ul.append(li);
                  let removeBtn = document.createElement("button");
                  removeBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;
                  ul.append(li);
                  ul.append(removeBtn);
                  removeBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    db.collection("songs")
                      .doc({ name: song })
                      .delete()
                      .then((e) => {
                        console.log("delete");
                      })
                      .catch((e) => {});

                    songList.filter((item) => {
                      return item !== song;
                    });

                    delete songList[index];

                    songList.pop();

                    inpFile.files[0].name = "";

                    removeBtn.previousElementSibling.remove();
                    removeBtn.remove();
                  });
                  li.addEventListener("click", (e) => {
                    db.collection("songs")
                      .get()
                      .then((song) => {
                        audio.setAttribute(
                          "src",
                          `audio/${e.target.textContent}`
                        );
                        marquee.textContent = e.target.textContent;
                        song.forEach((song, index) => {
                          if (e.target.innerHTML.includes(song.name)) {
                            audio.setAttribute("src", song.data);
                          }
                        });
                        playAndPause();
                      });
                  });
                });
              };
            }
          });
      });
  });
})();
