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

  function buildGrid() {
    for (let i = 0; i < highestStack * gridWidth; i++) {
      const pixel = document.createElement('div');
      pixel.className = 'pixel';
      pixel.style.height = `calc(100vh / ${highestStack})`;
      grid.appendChild(pixel);
    }
  }

  async function draw() {
    for (let i = 0; i < frames.length; i++) {
      [...frames[i]].forEach((pixel, i) => {
        buildPixel(i, pixel);
      });
      await delay(frameRate);
    }
  }

  async function delay(time) {
    await new Promise((res) => setTimeout(() => res(1), time));
  }

  function buildPixel(i, value) {
    const pixel = grid.childNodes[i];
    if (value !== ' ') {
      pixel.innerText = value;
      pixel.className = 'pixel';
    } else pixel.className = 'pixel hidden';
  }

  await readFrames();
  findHighestStack();
  squareSmallerFrames();
  buildGrid();
  grid.style.opacity = 1;
  draw();
})();
