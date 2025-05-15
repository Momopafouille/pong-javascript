const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bouton démarrer
const startButton = document.createElement("button");
startButton.textContent = "▶ Démarrer le jeu";
Object.assign(startButton.style, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "15px 30px",
  fontSize: "24px",
  cursor: "pointer",
  borderRadius: "10px",
  backgroundColor: "#ffffff22",
  color: "white",
  border: "2px solid white",
  zIndex: 10,
});
document.body.appendChild(startButton);

// Paramètres initiaux
const paddleWidth = 15;
const initialPaddleHeight = 180;
const paddleMinHeight = 60;
const initialBallSpeed = 5;
const ballSpeedMax = 15;
const paddleSpeed = 6;
const ballRadius = 10;

let leftPaddleY, rightPaddleY;
let ballX, ballY, ballSpeedX, ballSpeedY;
let paddleHeight, timeElapsed;
let scoreLeft = 0, scoreRight = 0;
let gameRunning = false;

let keys = {};

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// 🧼 Initialisation ou réinitialisation complète
function resetGameProgress() {
  paddleHeight = initialPaddleHeight;
  timeElapsed = 0;

  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * initialBallSpeed;
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * initialBallSpeed;
}

function drawRect(x, y, w, h, color = "white") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color = "white") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, color = "white", align = "center") {
  ctx.fillStyle = color;
  ctx.font = "40px Arial";
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

function update() {
  timeElapsed++;

  // Réduction paddle + accélération balle toutes les 3s
  if (timeElapsed % 180 === 0) {
    if (paddleHeight > paddleMinHeight) paddleHeight -= 5;
    if (Math.abs(ballSpeedX) < ballSpeedMax) {
      ballSpeedX *= 1.05;
      ballSpeedY *= 1.05;
    }
  }

  // Déplacement paddles
  if (keys["z"] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (keys["s"] && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
  if (keys["arrowup"] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
  if (keys["arrowdown"] && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

  // Balle
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Rebonds haut/bas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY *= -1;
  }

  // Collisions raquettes
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX *= -1;
    ballX = paddleWidth + ballRadius;
  }

  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX *= -1;
    ballX = canvas.width - paddleWidth - ballRadius;
  }

  // Point marqué
  if (ballX < 0) {
    scoreRight++;
    resetGameProgress(); // Réinitialise jeu
  }

  if (ballX > canvas.width) {
    scoreLeft++;
    resetGameProgress(); // Réinitialise jeu
  }
}

function drawBackground() {
  drawRect(0, 0, canvas.width / 2, canvas.height, "#0033cc");
  drawRect(canvas.width / 2, 0, canvas.width / 2, canvas.height, "#cc0000");
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Raquettes
  drawRect(0, leftPaddleY, paddleWidth, paddleHeight, "white");
  drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, "white");

  // Balle
  drawBall(ballX, ballY, ballRadius, "white");

  // Scores
  drawText(scoreLeft, canvas.width / 4, 50, "white");
  drawText(scoreRight, (canvas.width * 3) / 4, 50, "white");
}

function gameLoop() {
  if (gameRunning) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// ▶️ Bouton pour lancer le jeu
startButton.addEventListener("click", () => {
  gameRunning = true;
  startButton.style.display = "none";
  resetGameProgress();
  gameLoop();
});
