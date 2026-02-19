let song;
let fft;
let video;
let photo;
let particles = [];
let playlist = [];
let currentMedia = null;
let currentIndex = -1;
let circleX, circleY;
let zoomLevel = 1;

function setup() {
  let canvas = createCanvas(window.innerWidth * 0.9, 400);
  canvas.parent("canvas-container");

  fft = new p5.FFT();

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  circleX = width / 2;
  circleY = height / 2;

  loadAssets();
  loadPlaylistFromStorage();
  setupControls();

  document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
  });
}

function draw() {
  background(0, 30);

  // Animated element: moving circle towards mouse
  let dx = mouseX - circleX;
  let dy = mouseY - circleY;
  circleX += dx * 0.02;
  circleY += dy * 0.02;
  fill(255, 255, 0);
  ellipse(circleX, circleY, 20, 20);

  let isPlaying = currentMedia && (
    (currentMedia.type === 'audio' && currentMedia.object && currentMedia.object.isPlaying()) ||
    (currentMedia.type === 'video' && currentMedia.object)
  );

  if (isPlaying) {
    if (currentMedia.type === 'audio') {
      let spectrum = fft.analyze();

      // Frequency Bars
      for (let i = 0; i < spectrum.length; i += 10) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        fill(0, 255, 255);
        rect(x, height, width / spectrum.length * 10, h);
      }

      // Particles Reacting to Bass
      let bass = fft.getEnergy("bass");
      particles.forEach(p => {
        p.update(bass);
        p.show();
      });
    }

    if (currentMedia.type === 'video' && currentMedia.object) {
      let mediaWidth = currentMedia.object.width;
      let mediaHeight = currentMedia.object.height;
      let x = (width - mediaWidth * zoomLevel) / 2;
      let y = (height - mediaHeight * zoomLevel) / 2;
      push();
      imageMode(CORNER);
      image(currentMedia.object, x, y, mediaWidth * zoomLevel, mediaHeight * zoomLevel);
      pop();
    }

    if (currentMedia.type === 'photo' && currentMedia.object) {
      let mediaWidth = currentMedia.object.width;
      let mediaHeight = currentMedia.object.height;
      let x = (width - mediaWidth * zoomLevel) / 2;
      let y = (height - mediaHeight * zoomLevel) / 2;
      push();
      imageMode(CORNER);
      image(currentMedia.object, x, y, mediaWidth * zoomLevel, mediaHeight * zoomLevel);
      pop();
    }
  } else {
    // Beautiful moving scenes when nothing is playing or media is stopped
    // Floating particles
    particles.forEach(p => {
      p.update(50); // constant movement
      p.show();
    });

    // Wavy lines
    stroke(0, 255, 255, 100);
    noFill();
    for (let i = 0; i < 5; i++) {
      beginShape();
      for (let x = 0; x < width; x += 10) {
        let y = height / 2 + sin(x * 0.01 + frameCount * 0.02 + i) * 50;
        vertex(x, y);
      }
      endShape();
    }

    // Pulsing circles
    noStroke();
    fill(255, 0, 255, 50);
    for (let i = 0; i < 10; i++) {
      let x = width / 2 + cos(frameCount * 0.01 + i * 0.5) * 100;
      let y = height / 2 + sin(frameCount * 0.01 + i * 0.5) * 100;
      ellipse(x, y, 20 + sin(frameCount * 0.1 + i) * 10);
    }
  }
}

function setupControls() {

  document.getElementById("audioUpload").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (file) {
      addToPlaylist(file.name, 'audio', file);
    }
  });

  document.getElementById("videoUpload").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (file) {
      addToPlaylist(file.name, 'video', file);
    }
  });

  document.getElementById("photoUpload").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (file) {
      addToPlaylist(file.name, 'photo', file);
    }
  });

  document.getElementById("prevBtn").onclick = () => {
    if (playlist.length > 0) {
      let newIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      selectMedia(newIndex);
    }
  };

  document.getElementById("nextBtn").onclick = () => {
    if (playlist.length > 0) {
      let newIndex = (currentIndex + 1) % playlist.length;
      selectMedia(newIndex);
    }
  };

  document.getElementById("playBtn").onclick = () => {
    if (currentMedia && currentMedia.object) {
      if (currentMedia.type === 'audio') currentMedia.object.play();
      if (currentMedia.type === 'video') currentMedia.object.play();
    }
  };

  document.getElementById("pauseBtn").onclick = () => {
    if (currentMedia && currentMedia.object) {
      if (currentMedia.type === 'audio') currentMedia.object.pause();
      if (currentMedia.type === 'video') currentMedia.object.pause();
    }
  };

  document.getElementById("stopBtn").onclick = () => {
    if (currentMedia && currentMedia.object) {
      if (currentMedia.type === 'audio') currentMedia.object.stop();
      if (currentMedia.type === 'video') currentMedia.object.stop();
    }
  };

  document.getElementById("volumeSlider").oninput = (e) => {
    if (currentMedia && currentMedia.type === 'audio' && currentMedia.object) {
      currentMedia.object.setVolume(e.target.value);
    }
  };

  document.getElementById("speedSlider").oninput = (e) => {
    if (currentMedia && currentMedia.object) {
      if (currentMedia.type === 'audio') currentMedia.object.rate(e.target.value);
      if (currentMedia.type === 'video') currentMedia.object.speed(e.target.value);
    }
  };

  document.getElementById("zoomSlider").oninput = (e) => {
    zoomLevel = parseFloat(e.target.value);
  };
}

function loadAssets() {
  // List of files in assets folder. Edit this array to add your files.
  // Format: {name: 'filename', type: 'audio'|'video'|'photo'}
  const assetFiles = [
    {name: 'AMENIWEKA HURU KWELI(SkizaCode 6930218)- PAPI CLEVER & DORCAS Ft MERCI PIANIST - MORNING WORSHIP 146_1756537551126.mp3', type: 'audio'},
    {name: 'ANAYEKUPENDA PENDANA NAYE — Viral Luo Hit by Prince Indah  Dance Tribute by Proud Chocolate_1748189468890.m4a', type: 'audio'},
    {name: 'Atoto  Mr Mbalamwezi Ft Visita  Sms Skiza 69810760 to 811 to get Atoto_1748189386040.m4a', type: 'audio'}
  ];

  assetFiles.forEach(file => {
    let url = `assets/${file.name}`;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('File not found');
        return response.blob();
      })
      .then(blob => {
        addToPlaylist(file.name, file.type, blob);
      })
      .catch(err => console.log(`Asset ${file.name} not loaded:`, err));
  });
}

function loadPlaylistFromStorage() {
  let stored = localStorage.getItem('playlist');
  if (stored) {
    let data = JSON.parse(stored);
    data.forEach(item => {
      addStoredItemToPlaylist(item.name, item.type, item.dataURL);
    });
  }
}

function savePlaylistToStorage() {
  let data = playlist.map(item => ({name: item.name, type: item.type, dataURL: item.dataURL}));
  localStorage.setItem('playlist', JSON.stringify(data));
}

function addToPlaylist(name, type, file) {
  let reader = new FileReader();
  reader.onload = function(e) {
    let dataURL = e.target.result;
    let object;
    if (type === 'audio') {
      object = loadSound(dataURL);
    } else if (type === 'video') {
      object = createVideo([dataURL]);
      object.hide();
    } else if (type === 'photo') {
      object = loadImage(dataURL);
    }
    let item = {name, type, url: dataURL, object, dataURL, index: playlist.length};
    playlist.push(item);
    let li = document.createElement('li');
    li.textContent = `${type.toUpperCase()}: ${name}`;
    li.style.cursor = 'pointer';
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      removeFromPlaylist(item.index);
    };
    li.appendChild(deleteBtn);
    li.onclick = () => {
      selectMedia(item.index);
    };
    document.getElementById('playlist-items').appendChild(li);
    savePlaylistToStorage();
  };
  reader.readAsDataURL(file);
}

function addStoredItemToPlaylist(name, type, dataURL) {
  let object;
  if (type === 'audio') {
    object = loadSound(dataURL);
  } else if (type === 'video') {
    object = createVideo([dataURL]);
    object.hide();
  } else if (type === 'photo') {
    object = loadImage(dataURL);
  }
  let item = {name, type, url: dataURL, object, dataURL, index: playlist.length};
  playlist.push(item);
  let li = document.createElement('li');
  li.textContent = `${type.toUpperCase()}: ${name}`;
  li.style.cursor = 'pointer';
  let deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.marginLeft = '10px';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    removeFromPlaylist(item.index);
  };
  li.appendChild(deleteBtn);
  li.onclick = () => {
    selectMedia(item.index);
  };
  document.getElementById('playlist-items').appendChild(li);
}

function removeFromPlaylist(index) {
  // Stop if current
  if (currentIndex === index && currentMedia) {
    if (currentMedia.type === 'audio') currentMedia.object.stop();
    if (currentMedia.type === 'video') currentMedia.object.stop();
    currentMedia = null;
    currentIndex = -1;
  }
  // Remove from array
  playlist.splice(index, 1);
  // Update indices
  playlist.forEach((item, i) => item.index = i);
  // Update currentIndex if necessary
  if (currentIndex > index) currentIndex--;
  if (currentIndex >= playlist.length) currentIndex = playlist.length - 1;
  // Rebuild list
  let ul = document.getElementById('playlist-items');
  ul.innerHTML = '';
  playlist.forEach(item => {
    let li = document.createElement('li');
    li.textContent = `${item.type.toUpperCase()}: ${item.name}`;
    li.style.cursor = 'pointer';
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      removeFromPlaylist(item.index);
    };
    li.appendChild(deleteBtn);
    li.onclick = () => {
      selectMedia(item.index);
    };
    ul.appendChild(li);
  });
  savePlaylistToStorage();
}

function selectMedia(index) {
  // Stop current
  if (currentMedia && currentMedia.object) {
    if (currentMedia.type === 'audio') currentMedia.object.stop();
    if (currentMedia.type === 'video') currentMedia.object.stop();
  }
  // Set new
  currentIndex = index;
  currentMedia = playlist[index];
  // Auto play
  if (currentMedia.type === 'audio') {
    currentMedia.object.play();
  } else if (currentMedia.type === 'video') {
    currentMedia.object.loop();
  }
}

function keyPressed() {
  if (key === ' ') {
    // Space to play/pause
    if (currentMedia && currentMedia.object) {
      if (currentMedia.type === 'audio') {
        if (currentMedia.object.isPlaying()) {
          currentMedia.object.pause();
        } else {
          currentMedia.object.play();
        }
      }
      if (currentMedia.type === 'video') {
        if (currentMedia.object.elt.paused) {
          currentMedia.object.play();
        } else {
          currentMedia.object.pause();
        }
      }
    }
  }
  if (keyCode === UP_ARROW) {
    // Increase volume
    let vol = document.getElementById("volumeSlider").value;
    vol = Math.min(1, parseFloat(vol) + 0.1);
    document.getElementById("volumeSlider").value = vol;
    if (currentMedia && currentMedia.type === 'audio' && currentMedia.object) {
      currentMedia.object.setVolume(vol);
    }
  }
  if (keyCode === DOWN_ARROW) {
    // Decrease volume
    let vol = document.getElementById("volumeSlider").value;
    vol = Math.max(0, parseFloat(vol) - 0.1);
    document.getElementById("volumeSlider").value = vol;
    if (currentMedia && currentMedia.type === 'audio' && currentMedia.object) {
      currentMedia.object.setVolume(vol);
    }
  }
}

function mousePressed() {
  // Click on canvas to toggle play/pause only for video
  if (currentMedia && currentMedia.type === 'video' && currentMedia.object) {
    if (currentMedia.object.elt.paused) {
      currentMedia.object.play();
    } else {
      currentMedia.object.pause();
    }
  }
}

// Particle Class
class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 8);
  }

  update(bass) {
    this.y -= bass * 0.05;
    if (this.y < 0) this.y = height;
  }

  show() {
    fill(255, 0, 255);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}
