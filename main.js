const container = document.querySelector(".third");
const objects = [];
let clickCount = 0;
let gameOver = false;
const typesSequence = ["paper", "rock", "scissor"];
let timer = null;
let elapsedTime = 0;

const counter = { rock: 0, paper: 0, scissor: 0 };
const counterElement = document.getElementById("type-counter");

const timerElement = document.querySelector(".timerElement");
timerElement.style.marginTop = "10px";
timerElement.style.color = "black";
timerElement.style.fontSize = "18px";
counterElement.parentElement?.appendChild(timerElement);
updateTimer()

const music = new Audio("others/mortal_combat.mp3");
music.loop = true;
music.volume = 0.3;

const instruction = document.createElement("div");
instruction.className = "instruction";
instruction.textContent = "Нажмите в 3-х точках на белом листе, чтобы начать";
container.appendChild(instruction);

updateCounter();

let animationRunning = false;

container.addEventListener("click", (e) => {
  if (clickCount < 3 && !gameOver) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createParticles(x, y, typesSequence[clickCount]);
    clickCount++;
  }

  if (clickCount === 3 && instruction) {
    instruction.remove();
    // music.play()
  }

  if (clickCount === 1 && !timer) {
    music.play();
    timer = setInterval(() => {
      elapsedTime++;
      updateTimer();
    }, 1000);
  }
});

function createParticles(x, y, type) {
  const particlesPerType = 30;

  for (let i = 0; i < particlesPerType; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const particle = createParticle(x, y, dx, dy, speed, type);
    objects.push(particle);
    counter[type]++;
  }

  updateCounter();

  if (!animationRunning) {
    animationRunning = true;
    animateParticles();
  }
}

function animateParticles() {
  if (!animationRunning) return;

  objects.forEach((obj) => {
    obj.x += obj.dx * obj.speed;
    obj.y += obj.dy * obj.speed;

    if (obj.x <= 0 || obj.x >= container.offsetWidth - 30) obj.dx *= -1;
    if (obj.y <= 0 || obj.y >= container.offsetHeight - 30) obj.dy *= -1;

    obj.element.style.left = `${obj.x}px`;
    obj.element.style.top = `${obj.y}px`;

    objects.forEach((other) => {
      if (other !== obj && isCollision(obj, other)) {
        handleCollision(obj, other);
      }
    });
  });

  checkGameEnd();
  requestAnimationFrame(animateParticles);
}

function createParticle(x, y, dx, dy, speed, type) {
  const div = document.createElement("div");
  div.className = `particle ${type}`;
  applyStyles(div, {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: "30px",
    height: "30px",
  });

  const img = document.createElement("img");
  img.src = `images/${type}.gif`;
  applyStyles(img, {
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });

  div.appendChild(img);
  container.appendChild(div);

  return { element: div, type, x, y, dx, dy, speed };
}

function isCollision(a, b) {
  return !(
    a.x + 30 < b.x ||
    a.x > b.x + 30 ||
    a.y + 30 < b.y ||
    a.y > b.y + 30
  );
}

function handleCollision(a, b) {
  const winMap = { rock: "scissor", paper: "rock", scissor: "paper" };

  if (winMap[a.type] === b.type) {
    counter[b.type]--;
    b.type = a.type;
    counter[b.type]++;
    updateParticleType(b);
  } else if (winMap[b.type] === a.type) {
    counter[a.type]--;
    a.type = b.type;
    counter[a.type]++;
    updateParticleType(a);
  }

  updateCounter();
}

function updateParticleType(particle) {
  const img = particle.element.querySelector("img");
  img.src = `images/${particle.type}.gif`;
}

function updateCounter() {
  counterElement.innerHTML = `
    <span style="margin-right: 15px;">
      <img src="images/rock.gif" style="width:24px;vertical-align:middle;"> ${counter.rock}
    </span>
    <span style="margin-right: 15px;">
      <img src="images/paper.gif" style="width:24px;vertical-align:middle;"> ${counter.paper}
    </span>
    <span>
      <img src="images/scissor.gif" style="width:24px;vertical-align:middle;"> ${counter.scissor}
    </span>
  `;
}

function checkGameEnd() {
  if (clickCount < 3 || gameOver) return;
  const unique = [...new Set(objects.map((obj) => obj.type))];

  if (unique.length === 1 && !gameOver) {
    gameOver = true;


    displayGameOverMessage(unique[0]);
    clearInterval(timer);
    timer = null;
  }
}

function updateTimer() {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerElement.textContent = `⏱ Время: ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function displayGameOverMessage(winnerType) {
  const overlay = document.createElement("div");
  overlay.className = "overlay"

  const message = document.createElement("div");
  message.textContent = `Игра окончена. Победила ${winnerType}`;
  message.className = "message"
 

  const image = document.createElement("img");
  image.src = `images/${winnerType}.gif`;
  applyStyles(image, {
    width: "80px",
    height: "80px",
    marginBottom: "20px",
  });

  const button = document.createElement("button");
  button.textContent = "Начать заново";
  button.className = "button"

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    resetGame(overlay);
    // music.play();
    music.currentTime = 0;
  });

  const finalTime = document.createElement("div");
  const h = Math.floor(elapsedTime / 3600);
  const m = Math.floor((elapsedTime % 3600) / 60);
  const s = elapsedTime % 60;
  finalTime.textContent = `Ваше время: ${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
  applyStyles(finalTime, {
    color: "white",
    fontSize: "16px",
    marginTop: "10px",
  });

  overlay.appendChild(message);
  overlay.appendChild(image);
  overlay.appendChild(button);
  overlay.appendChild(finalTime);
  container.appendChild(overlay);
}

function resetGame(overlay) {
  overlay.remove();
  objects.forEach((obj) => obj.element.remove());
  objects.length = 0;
  window.animationStarted = false;
  animationRunning = false;
  gameOver = false;
  clickCount = 0;
  container.appendChild(instruction);
  counter.rock = 0;
  counter.paper = 0;
  counter.scissor = 0;
  updateCounter();

  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  elapsedTime = 0;
  updateTimer();
}

function applyStyles(el, styles) {
  Object.assign(el.style, styles);
}
