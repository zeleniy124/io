import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const skins = document.querySelectorAll('.skin'); // Select all skin elements

let selectedSkinIndex = '1'; // Default to the first skin, or a safe default

skins.forEach((skin) => {
  skin.addEventListener('click', function() {
    skins.forEach(s => s.classList.remove('active')); // Remove active class from all skins
    this.classList.add('active'); // Add active class to clicked skin
    selectedSkinIndex = this.getAttribute('data-index'); // Get the data-index attribute
  });
});

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    const username = usernameInput.value.trim();
    if (username) {
      console.log('Play button clicked. Username:', username, 'Selected skin index:', selectedSkinIndex);
      play(username, selectedSkinIndex); // Pass the username and selected skin index to the play function
      playMenu.classList.add('hidden');
      initState();
      startCapturingInput();
      startRendering();
      setLeaderboardHidden(false);
    } else {
      console.error('Username is required.');
      alert('Please enter a username.');
    }
  };
}).catch((error) => {
  console.error('Error in initial setup:', error);
});

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
}