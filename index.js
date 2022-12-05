const gridWidth = 9;
const grid = document.querySelector('#grid');
const speed = document.querySelector('#speed');
let frameRate = 1000;

document.addEventListener('mousemove', (e) => {
  const percent = e.screenX / window.innerWidth;
  frameRate = percent * 500 + 10;
  speed.innerText = 'Speed: ' + (100 - Math.ceil(percent * 100));
});

(async () => {
  let highestStack = 0;
  let frames = [];

  async function readFrames() {
    const framesData = await (await fetch('./frames.txt')).json();
    frames = framesData
      .toString()
      .split(',')
      .map((frame) => frame.replace(/\n/g, ''));
  }

  function findHighestStack() {
    frames.forEach((frame, i) => {
      const frameHeight = frame.length / gridWidth;
      if (frameHeight > highestStack) {
        highestStack = frameHeight;
      }
    });
  }

  function squareSmallerFrames() {
    frames = frames.map((frame) => {
      const d = highestStack * gridWidth - frame.length;
      for (let i = 0; i < d; i++) {
        frame = ' ' + frame;
      }
      return frame;
    });
  }

  async function buildGrid() {
    for (let i = 0; i < frames.length; i++) {
      grid.innerHTML = '';
      [...frames[i]].forEach((pixel) => {
        buildPixel(pixel);
      });
      await delay(frameRate);
    }
  }

  async function delay(time) {
    await new Promise((res) => setTimeout(() => res(1), time));
  }

  function buildPixel(value) {
    const pixel = document.createElement('div');
    pixel.style.height = `calc(100vh / ${highestStack})`;
    pixel.className = 'pixel';
    if (value !== ' ') pixel.innerText = value;
    else pixel.style.background = 'white';
    grid.appendChild(pixel);
  }

  await readFrames();
  findHighestStack();
  squareSmallerFrames();
  buildGrid();
})();
