const container = document.querySelector(".third");
const objects = [];
let clickCount = 0; // Счётчик количества кликов
let gameOver = false; //Флаг завершения игры

const counter = {
  rock: 0,
  paper: 0,
  scissor: 0,
};

const counterElement = document.getElementById("type-counter");
// counterElement.style.position = 'absolute';
counterElement.style.top = "50px";
counterElement.style.right = "100px";
counterElement.style.color = "white";
counterElement.style.fontSize = "18px";

function updateCounter() {
  // counterElement.innerHTML = `
  counterElement.innerHTML = `
        <span style="margin-right: 15px;">
            <img src="images/rock.png" alt="rock" style="width: 24px; vertical-align: middle;"> ${counter.rock}
        </span>
        <span style="margin-right: 15px;">
            <img src="images/paper.png" alt="paper" style="width: 24px; vertical-align: middle;"> ${counter.paper}
        </span>
        <span>
            <img src="images/scissor.png" alt="scissor" style="width: 24px; vertical-align: middle;"> ${counter.scissor}
        </span>
    `;
  // counterElement.textContent = `rock: ${counter.rock}  paper: ${counter.paper}   scissor: ${counter.scissor}`
}

// Создаём стартовую инструкцию
const instruction = document.createElement("div");
instruction.className = "instruction";
instruction.textContent = "Нажмите в 3-х точках на белом листе, чтобы начать";
instruction.style.position = "absolute";
instruction.style.top = "20px";
instruction.style.left = "50%";
instruction.style.transform = "translateX(-50%)";
instruction.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
instruction.style.padding = "10px 20px";
instruction.style.borderRadius = "8px";
instruction.style.fontSize = "18px";
instruction.style.color = "#333";
instruction.style.zIndex = "1001";
instruction.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
container.appendChild(instruction);

container.addEventListener("click", (e) => {
  if (clickCount < 3 && !gameOver) {
    // Добавляем только 3 клика если игра не завершена
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createParticles(x, y, clickCount);
    clickCount++; // Увеличиваем счётчик кликов
  }

  if (clickCount === 3 && instruction) {
    instruction.remove();
  }
});

function createParticles(x, y, clickIndex) {
  const types = ["paper", "rock", "scissor"]; // Типы частиц
  const type = types[clickIndex]; // Определяем тип на основе клика
  const particlesPerType = 30;

  // Создаем 10 частиц выбранного типа
  for (let i = 0; i < particlesPerType; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2;

    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const div = document.createElement("div");
    div.className = `particle ${type}`;
    div.style.position = "absolute";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = "30px";
    div.style.height = "30px";

    const img = document.createElement("img");
    img.src = `images/${type}.png`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.pointerEvents = "none";

    div.appendChild(img);
    container.appendChild(div);

    objects.push({
      element: div,
      type: type,
      x: x,
      y: y,
      dx: dx,
      dy: dy,
      speed: speed,
    });

    counter[type]++;
  }

  updateCounter();
  if (!window.animationStarted) {
    window.animationStarted = true;
    animateParticles();
  }

  function animateParticles() {
    objects.forEach((object) => {
      object.x += object.dx * object.speed;
      object.y += object.dy * object.speed;

      if (object.x <= 0 || object.x >= container.offsetWidth - 30) {
        object.dx = -object.dx;
      }

      if (object.y <= 0 || object.y >= container.offsetHeight - 30) {
        object.dy = -object.dy;
      }

      object.element.style.left = `${object.x}px`;
      object.element.style.top = `${object.y}px`;

      objects.forEach((otherObject) => {
        if (otherObject !== object && isCollision(object, otherObject)) {
          handleCollision(object, otherObject);
        }
      });
    });

    // Проверяем, все ли частицы одного типа
    checkGameEnd();

    requestAnimationFrame(animateParticles);
  }

  function isCollision(obj1, obj2) {
    return !(
      obj1.x + 30 < obj2.x ||
      obj1.x > obj2.x + 30 ||
      obj1.y + 30 < obj2.y ||
      obj1.y > obj2.y + 30
    );
  }

  function handleCollision(obj1, obj2) {
    const winMap = {
      rock: "scissor",
      paper: "rock",
      scissor: "paper",
    };

    if (winMap[obj1.type] === obj2.type) {
      counter[obj2.type]--;
      obj2.type = obj1.type;
      counter[obj2.type]++;
      updateParticleType(obj2);
    } else if (winMap[obj2.type] === obj1.type) {
      counter[obj1.type]--;
      obj1.type = obj2.type;
      counter[obj1.type]++;
      updateParticleType(obj1);
      updateCounter();
    }
  }

  function updateParticleType(particle) {
    const img = particle.element.querySelector("img");
    img.src = `images/${particle.type}.png`;
  }

  function checkGameEnd() {
    if (clickCount < 3 || gameOver) return;

    const types = objects.map((object) => object.type);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 1 && !gameOver) {
      gameOver = true;
      const winnerType = uniqueTypes[0];
      displayGameOverMessage(winnerType);
    }
  }

  function displayGameOverMessage(winnerType) {
    const overlay = document.createElement("div");
    overlay.className = "game-over-overlay";
    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    const message = document.createElement("div");
    message.style.color = "#fff";
    message.style.fontSize = "24px";
    message.style.marginBottom = "20px";
    message.textContent = `Игра окончена. Победила ${winnerType}`;

    const image = document.createElement("img");
    image.src = `images/${winnerType}.png`;
    image.style.width = "80px";
    image.style.height = "80px";
    image.style.marginBottom = "20px";

    const button = document.createElement("button");
    button.textContent = "Начать заново";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#4caf50";
    button.style.color = "white";

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      overlay.remove();
      objects.forEach((obj) => obj.element.remove());
      objects.length = 0;
      window.animationStarted = false;
      gameOver = false;
      clickCount = 0;
      container.appendChild(instruction);

      counter.rock = 0;
      counter.paper = 0;
      counter.scissor = 0;
      updateCounter();
    });

    overlay.appendChild(message);
    overlay.appendChild(image);
    overlay.appendChild(button);
    container.appendChild(overlay);
  }
}
