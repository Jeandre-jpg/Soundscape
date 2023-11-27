
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

let selections = [];

document.addEventListener('DOMContentLoaded', function() {
  showResults();
  document.getElementById('first-container').style.display = 'block';
  document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('first-container').style.display = 'none';
    document.getElementById('card1').style.display = 'block';
    startImageLoop(card1Images, 'dynamic-image-card1');
  });
});

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

// function testShowResults() {
//   // Test data
//   selections = [
//     { optionName: 'Test Option 1', imageName: 'test1.jpg', soundFileName: 'test1.wav' },
//     { optionName: 'Test Option 2', imageName: 'test2.jpg', soundFileName: 'test2.wav' }
//   ];

//   showResults();
// }

// Call this function when the DOM is fully loaded to test
document.addEventListener('DOMContentLoaded', testShowResults);


function showResults() {
  console.log('showResults called');

  const resultsContainer = document.getElementById('results');
  if (!resultsContainer) {
    console.error('Results container not found');
    return;
  }
  console.log('Results container found:', resultsContainer);

  if (selections.length === 0) {
    console.warn('Selections array is empty.');
    resultsContainer.innerHTML = '<p>No selections have been made.</p>';
    return;
  }
  

  console.log('Current selections:', selections);

  resultsContainer.innerHTML = ''; // Clear previous results
  resultsContainer.style.display = 'flex'; // Make sure it's visible

  selections.forEach(selection => {
    console.log('Creating result for:', selection);

    const resultElement = document.createElement('div');
    resultElement.classList.add('result-card');
    resultElement.innerHTML = `
      <h3>${selection.optionName}</h3>
      <img src="src/assets/icons/${selection.imageName}" alt="${selection.optionName}" class="result-image">
      <audio controls>
        <source src="src/assets/sounds/${selection.soundFileName}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    `;

    resultsContainer.appendChild(resultElement);
    console.log('Created result element:', resultElement);
  });
}




// function showResults() {
//   try {
//     console.log('showResults called');
//     console.log('Selections:', selections);

//     const resultsContainer = document.getElementById('results');
//     if (!resultsContainer) {
//       console.error('Results container not found');
//       return;
//     }

//     // Clear previous results and make the container visible
//     resultsContainer.innerHTML = '';
//     resultsContainer.style.display = 'block'; // Make sure the container is visible

//     // Iterate over selections and create result elements
//     selections.forEach(selection => {
//       const resultElement = document.createElement('div');
//       resultElement.classList.add('result-card');
//       resultElement.innerHTML = `
//         <h3>${selection.optionName}</h3>
//         <img src="src/assets/icons/${selection.imageName}" alt="${selection.optionName}" class="result-image">
//         <audio controls>
//           <source src="src/assets/sounds/${selection.soundFileName}" type="audio/mpeg">
//           Your browser does not support the audio element.
//         </audio>
//       `;
//       resultsContainer.appendChild(resultElement);
//     });
//   } catch (error) {
//     console.error('Error in showResults:', error);
//   }
// }
