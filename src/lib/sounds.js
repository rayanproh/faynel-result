
const audioCache = {};

const getAudio = (soundName) => {
  if (!audioCache[soundName]) {
    audioCache[soundName] = new Audio(`/${soundName}`);
  }
  return audioCache[soundName];
};

export const playSound = (soundName) => {
  const audio = getAudio(soundName);
  audio.currentTime = 0;
  audio.play().catch(error => console.error(`Error playing sound: ${soundName}`, error));
};

let backgroundMusic = null;

export const playBackgroundMusic = (soundName) => {
  if (backgroundMusic && !backgroundMusic.paused) {
    return;
  }
  backgroundMusic = getAudio(soundName);
  backgroundMusic.loop = true;
  backgroundMusic.play().catch(error => console.error(`Error playing background music: ${soundName}`, error));
};

export const stopBackgroundMusic = () => {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic = null;
  }
};
