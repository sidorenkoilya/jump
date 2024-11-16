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
  platforms = [];
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: Math.random() * (canvas.width - 70),
      y: i * 100,
      width: 70,
      height: 10,
      visible: true,
    });
  }
  platforms[0].x = player.x - 25; // Игрок стоит по центру платформы
  platforms[0].y = player.y + 20;
  platforms[0].visible = true;
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

// Конец игры
function endGame() {
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").textContent = `Ваш результат: ${score}`;
  canvas.style.display = "none";
}

// Игровой цикл
function gameLoop() {
  if (isGameOver) {
    endGame();
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

// Функция старта игры
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  canvas.style.display = "block";
  isGameOver = false;
  player = { x: 200, y: 500, width: 20, height: 20, dy: 0 };
  score = 0;
  createPlatforms();
  gameLoop();
}

// Функция для повторного запуска игры
function retryGame() {
  startGame();
}

// Функция для публикации результата
function shareScore() {
  const shareText = `Я набрал ${score} очков в игре Shadow Jump! Попробуй побить мой результат!`;
  if (navigator.share) {
    navigator.share({
      title: "Shadow Jump",
      text: shareText,
      url: window.location.href,
    });
  } else {
    alert("Ваш результат скопирован: " + shareText);
    navigator.clipboard.writeText(shareText);
  }
}

// Обработчики кнопок
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("retryButton").addEventListener("click", retryGame);
document.getElementById("shareButton").addEventListener("click", shareScore);
