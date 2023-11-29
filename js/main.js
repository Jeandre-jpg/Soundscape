
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


function showModal() {
  var modal = document.getElementById('myModal');
  modal.classList.add('show');
}

function hideResults() {
  var resultsContainer = document.getElementById('results');
  if (resultsContainer) {
    resultsContainer.style.display = 'none';
  } else {
    console.error('Results container element not found.');
  }
}

function hideModal() {
  var modal = document.getElementById('myModal');
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error('Modal element not found.');
  }
}

function showFirstContainerAndHideCards() {
  hideResults();
  hideModal();
  const cardIds = ['card1', 'card2', 'card3']; // Use the exact IDs of your cards
  cardIds.forEach(id => {
    const card = document.getElementById(id);
    if (card) {
      card.style.display = 'none';
    }
  });

  // Show the first container
  const firstContainer = document.getElementById('first-container');
  if (firstContainer) {
    firstContainer.style.display = 'block'; // Make sure 'block' is the correct display style
    firstContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    console.error('Element with ID "firstContainer" not found.');
  }
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
      document.getElementById('play-pause-button').textContent = '❚❚';
    });
  } else {
    audioContext.suspend().then(() => {
      document.getElementById('play-pause-button').textContent = '▶';
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
});

document.addEventListener('DOMContentLoaded', function() {
  showResults();

  const exploreButton = document.getElementById('exploreButton');
  if (exploreButton) {
    exploreButton.addEventListener('click', function() {
      // Reload the current page
      document.body.classList.add('fadeOut');
      setTimeout(function() {
        location.reload();
      }, 500); 
    });
  } else {
    console.error('Explore button not found.');
  }


  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName('close')[0];

  document.getElementById('kill-switch').addEventListener('click', function() {
    modal.style.display = 'block';
    stopAllAudio(); // existing functionality to stop all audio
  });

  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }






  document.querySelector('.modal .close').addEventListener('click', hideModal);

// Event listener to hide modal if clicked outside of it
window.addEventListener('click', function(event) {
  var modal = document.getElementById('myModal');
  if (event.target == modal) {
    hideModal();
  }
});

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

  document.getElementById('kill-switch').addEventListener('click', () => {
    function stopAllAudio() {
      audioSources.forEach(source => {
        source.source.stop();
        source.gainNode.disconnect();
      });
      audioSources = [];
    }
  });

  document.getElementById('play-button').addEventListener('click', () => {
    if (selections.length === 0) {
      console.warn('No selections have been made. Cannot play sounds.');
      return;
    }

    playSounds(selections);
  });
  
  
  
function setupAudioControls() {

  document.getElementById('controls-container').style.display = 'none';
  document.getElementById('results').style.display = 'none';

  const controlsContainer = document.getElementById('controls-container');

  // Create play/pause button
  const playPauseButton = document.createElement('button');
  playPauseButton.id = 'play-pause-button';
  playPauseButton.innerHTML = '❚❚';
  playPauseButton.style.display ="flex";
  controlsContainer.appendChild(playPauseButton);
  playPauseButton.addEventListener('click', togglePlayPause);

  // Create kill switch button
  const killSwitch = document.createElement('button');
  killSwitch.innerHTML = '☠️ Restart';
  killSwitch.id = 'kill-switch';
  killSwitch.style.color = '#cfb7ac;';
  killSwitch.addEventListener('click', stopAllAudio);

  const playAllButton = document.createElement('button');
  playAllButton.innerHTML = '';
  playAllButton.style.display = "flex";
  playAllButton.style.textAlign = "center";
  playAllButton.id = 'play-all-button';
  playAllButton.addEventListener('click', () => playSounds(selections));

  // Append buttons to the container
  controlsContainer.appendChild(playAllButton)
  controlsContainer.appendChild(playPauseButton);
  controlsContainer.appendChild(killSwitch);
  ;
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
}
    // Check if all three options have been chosen
    if (selections.length === 3) {
      showResults();
  }
}

function showResults() {
  console.log('showResults called');

  const resultsContainer = document.getElementById('results');
  const visualizerContainer = document.getElementById('audio-visualizer-container');
  const controlsContainer = document.getElementById('controls-container');


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
  controlsContainer.style.display = 'flex'; 

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

   
  }

  async function playSounds(selections) {
    if (!audioContext) {
      console.error('Audio context not supported');
      return;
    }
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
  
 



