
const card1Images = [
  'amb_cave.jpg',
  'amb_dense_forest.jpg',
  'amb_electric_planet.jpg',
  'amb_infested_swamp.jpg',
  'amb_lava_wasteland.jpg',
  'amb_mars_wasteland.jpg',
  'amb_spaceship.jpg',
  'amb_stormy_weather.jpg',
];

const card2Images = [
  'char_alien.jpg',
  'char_imp.jpg',
  'char_minotaur.jpg',
  'char_phoenix.jpg',
  'char_predator.jpg',
  'char_rock_golem.jpg',
  'char_wendigo.jpg',
  'char_werewolf.jpg',
];

const card3Images = [
  'sce_gunfight.jpg',
  'sce_helicopter.jpg',
  'sce_siren.jpg',
];
let currentImageIndex = 0;
let imageInterval;

function changeImageSmoothly(imageElement, newSrc) {
  if (!imageElement) return;

  imageElement.classList.remove('fade-in');

  setTimeout(() => {
    imageElement.src = `src/assets/icons/${newSrc}`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        imageElement.classList.add('fade-in');
      });
    });
  }, 500); 
}


function startImageLoop(images, imageElementId) {
  const imageElement = document.getElementById(imageElementId);
  if (!images || images.length === 0 || !imageElement) {
    console.error('Images array is empty or image element not found.');
    return;
  }

  imageElement.src = `src/assets/icons/${images[currentImageIndex]}`;
  imageElement.classList.add('fade-in');

  if (imageInterval) clearInterval(imageInterval);

  imageInterval = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length; 
    changeImageSmoothly(imageElement, images[currentImageIndex]);
  }, 1500); 
}

function togglePlayPause() {
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      document.getElementById('play-pause-button').textContent = 'Pause';
    });
  } else {
    audioContext.suspend().then(() => {
      document.getElementById('play-pause-button').textContent = 'Play';
    });
  }
}

function stopAllAudio() {
  audioSources.forEach(source => {
    if (source.source) {
      source.source.stop();
      source.gainNode.disconnect();
    }
  });
  audioSources = [];
}

let selections = [];
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSources = []; 

// Call setupAudioControls after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupAudioControls();
  // ... other initialization code ...
});

document.addEventListener('DOMContentLoaded', function() {
  showResults();

  document.getElementById('first-container').style.display = 'block';
  document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('first-container').style.display = 'none';
    document.getElementById('card1').style.display = 'block';
    startImageLoop(card1Images, 'dynamic-image-card1');
  });


  const visualizerContainer = document.getElementById('audio-visualizer-container');
  if (!visualizerContainer) {
    console.error('The audio visualizer container was not found in the DOM.');
    return;
  }

  const visualizer = document.createElement('div');
  visualizer.className = 'audio-visualizer';
  visualizer.innerHTML = '<div class="progress"></div>';
  visualizerContainer.appendChild(visualizer);

  setupAudioControls();

  document.getElementById('play-all-button').addEventListener('click', () => {
    if (selections.length === 0) {
      console.warn('No selections have been made. Cannot play sounds.');
      return;
    }
    playSounds(selections);
  });

});

  // Event listeners for controls
  document.getElementById('play-pause-button').addEventListener('click', () => {
    function togglePlayPause() {
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log("Playback resumed successfully");
          playPauseButton.textContent = 'Pause'; // Update button text to 'Pause'
        });
      } else {
        audioContext.suspend().then(() => {
          console.log("Playback suspended successfully");
          playPauseButton.textContent = 'Play'; // Update button text to 'Play'
        });
      }
    }
  });
  
  function stopAllAudio() {
    audioSources.forEach(source => {
      source.source.stop();
      source.gainNode.disconnect();
    });
    audioSources = [];
  }
  

function setupAudioControls() {
  const controlsContainer = document.getElementById('controls-container');

  // Create play/pause button
  const playPauseButton = document.createElement('button');
  playPauseButton.id = 'play-pause-button';
  playPauseButton.innerHTML = '▶️';
  controlsContainer.appendChild(playPauseButton);


  playPauseButton.addEventListener('click', togglePlayPause);

  // Create kill switch button
  const killSwitch = document.createElement('button');
  killSwitch.innerText = 'Stop and Reset';
  killSwitch.id = 'kill-switch';
  killSwitch.addEventListener('click', stopAllAudio);

  // Append buttons to the container
  controlsContainer.appendChild(playPauseButton);
  controlsContainer.appendChild(killSwitch);
}

function selectOption(nextCardId, optionName, imageName, soundFileName) {
  selections.push({ optionName, imageName, soundFileName });
  console.log('Selected option:', optionName);

  const currentCard = document.querySelector('.quiz-container-q:not([style*="display: none"])');
  if (currentCard) {
    currentCard.style.display = 'none';
  }

  if (nextCardId) {
    const nextCard = document.getElementById(nextCardId);
    if (nextCard) {
      nextCard.style.display = 'block';
      switch (nextCardId) {
        case 'card1': startImageLoop(card1Images, 'dynamic-image-card1'); break;
        case 'card2': startImageLoop(card2Images, 'dynamic-image-card2'); break;
        case 'card3': startImageLoop(card3Images, 'dynamic-image-card3'); break;
      }
    } 
    if (selections.length === 0) {
      console.warn('No selections to show.');
      return;
    }
    showResults();
  }
}


function showResults() {
  console.log('showResults called');

  const resultsContainer = document.getElementById('results');
  const visualizerContainer = document.getElementById('audio-visualizer-container');

  console.log('Results container:', resultsContainer);
  console.log('Visualizer container:', visualizerContainer);

  if (!resultsContainer || !visualizerContainer) {
    console.error('One or more containers not found');
    return;
  }

  if (selections.length === 0) {
    console.warn('Selections array is empty.');
    resultsContainer.innerHTML = '<p>No selections have been made.</p>';
    return;
  }

  console.log('Current selections:', selections);
  
  visualizerContainer.innerHTML = '';
  resultsContainer.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'flex'; // Make sure it's visible

  selections.forEach(selection => {
    console.log('Creating result for:', selection);

    const resultElement = document.createElement('div');
    resultElement.classList.add('result-card');
    resultElement.innerHTML = `
      <img src="src/assets/icons/${selection.imageName}" alt="${selection.optionName}" class="result-image">
      <audio controls controlsList="nodownload noplaybackrate">
        <source src="src/assets/sounds/${selection.soundFileName}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `;

    resultsContainer.appendChild(resultElement);
  });



  function togglePlayPause() {
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        document.getElementById('play-pause-button').textContent = 'Pause';
      });
    } else {
      audioContext.suspend().then(() => {
        document.getElementById('play-pause-button').textContent = 'Play';
      });
    }
  }

    const playAllButton = document.createElement('button');
    playAllButton.innerText = 'Play All';
    playAllButton.id = 'play-all-button';
    visualizerContainer.appendChild(playAllButton);
    visualizerContainer.style.display = 'block'; // Make visualizer container visible
  
    playAllButton.addEventListener('click', () => playSounds(selections));
  }


document.getElementById('kill-switch').addEventListener('click', () => {
  // Your kill switch logic here
});

  async function playSounds(selections) {
    if (!audioContext) {
      console.error('Audio context not supported');
      return;
    }
  
    // Clear any previous sounds.
    stopAllAudio();
  
    try {
      // Fetch and decode all audio files, then play them.
      const audioBuffers = await Promise.all(
        selections.map(selection => fetchAndDecodeAudio(`src/assets/sounds/${selection.soundFileName}`))
      );
  
      audioBuffers.forEach(buffer => {
        playAudioBuffer(buffer);
      });
    } catch (error) {
      console.error('Error during audio playback:', error);
    }
  }
  
  async function fetchAndDecodeAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
  }
  
  function playAudioBuffer(audioBuffer) {
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    
    const gainNode = audioContext.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    sourceNode.start();
    audioSources.push({ source: sourceNode, gainNode: gainNode });
  }
  
 

document.getElementById('play-button').addEventListener('click', () => {
  // Make sure selections have been made
  if (selections.length === 0) {
    console.warn('No selections have been made. Cannot play sounds.');
    return;
  }

  // Call playSounds to start playback
  playSounds(selections);
});

