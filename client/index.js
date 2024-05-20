import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const connectWalletButton = document.getElementById('connect-wallet-button');
const skins = document.querySelectorAll('.skin'); // Select all skin elements

let selectedSkinIndex = '1'; // Default to the first skin, or a safe default

skins.forEach((skin) => {
  skin.addEventListener('click', function() {
    skins.forEach(s => s.classList.remove('active')); // Remove active class from all skins
    this.classList.add('active'); // Add active class to clicked skin
    selectedSkinIndex = this.getAttribute('data-index'); // Get the data-index attribute
  });
});

async function connectWallet() {
  try {
    const { solana } = window;
    if (solana && solana.isPhantom) {
      const response = await solana.connect(); // Connects to the Phantom wallet
      console.log('Connected with Public Key:', response.publicKey.toString());
      return response.publicKey;
    } else {
      alert('Solana wallet not found! Please install Phantom.');
      throw new Error('Wallet not found');
    }
  } catch (error) {
    console.error('Connection to Phantom failed', error);
    throw error;
  }
}

connectWalletButton.onclick = async () => {
  const publicKey = await connectWallet();
  if (publicKey) {
    playMenu.classList.remove('hidden');
  }
};

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = async () => {
    console.log('Play button clicked. Selected skin index:', selectedSkinIndex);
    try {
      const publicKey = await connectWallet();
      if (publicKey) {
        play(publicKey.toString(), selectedSkinIndex); // Pass the selected skin index to the play function
        playMenu.classList.add('hidden');
        initState();
        startCapturingInput();
        startRendering();
        setLeaderboardHidden(false);
      } else {
        console.error('No public key returned. Wallet connection may have failed.');
      }
    } catch (error) {
      console.error('Error in wallet connection or game initialization:', error);
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
