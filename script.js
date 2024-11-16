const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Настройки игрового поля
canvas.width = 400;
canvas.height = 600;

// Игровые переменные
let player = { x: 200, y: 500, width: 20, height: 20, dy: 0 };
let platforms = [];
let score = 0;
let isGameOver = false;

// Создание платформ
function createPlatforms() {
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 70),
      y: i * 100,
      width: 70,
      height: 10,
      visible: true,
    });
  }
}

// Рисование игрока
function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Рисование платформ
function drawPlatforms() {
  platforms.forEach((platform) => {
    if (platform.visible) {
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  });
}

// Обновление платформ
function updatePlatforms() {
  platforms.forEach((platform) => {
    platform.y += 2;
    if (platform.y > canvas.height) {
      platform.y = -10;
      platform.x = Math.random() * (canvas.width - platform.width);
      platform.visible = true;
      score++;
    }
  });
}

// Проверка столкновений
function checkCollision() {
  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height < platform.y + platform.height &&
      player.y + player.height > platform.y &&
      platform.visible
    ) {
      player.dy = -10; // Отскок игрока
      platform.visible = false; // Платформа исчезает
    }
  });
}

// Обновление игрока
function updatePlayer() {
  player.y += player.dy;
  player.dy += 0.5; // Гравитация

  if (player.y > canvas.height) {
    isGameOver = true;
  }
}

// Рисование очков
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Игровой цикл
function gameLoop() {
  if (isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 40);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawPlatforms();
  drawScore();

  updatePlayer();
  updatePlatforms();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

// Управление игроком
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" && player.x > 0) {
    player.x -= 20;
  } else if (e.code === "ArrowRight" && player.x + player.width < canvas.width) {
    player.x += 20;
  }
});

// Запуск игры
createPlatforms();
gameLoop();
