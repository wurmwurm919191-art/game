const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 플레이어
const player = {
  x: 180,
  y: 520,
  width: 40,
  height: 40,
  speed: 5
};

// 상태
let bullets = [];
let enemies = [];
let keys = {};
let gameOver = false;

// 키 입력
document.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (e.code === "Space") shoot();
});

document.addEventListener("keyup", e => {
  keys[e.code] = false;
});

// 총알 발사
function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 10,
    speed: 7
  });
}

// 적 생성
function spawnEnemy() {
  enemies.push({
    x: Math.random() * 360,
    y: -40,
    width: 40,
    height: 40,
    speed: 1.5
  });
}

// 충돌 판정
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 업데이트
function update() {
  if (gameOver) return;

  // 이동
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;

  // 화면 밖 방지
  player.x = Math.max(0, Math.min(360, player.x));
  player.y = Math.max(0, Math.min(560, player.y));

  // 총알 이동
  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y > -10);

  // 적 이동
  enemies.forEach(e => e.y += e.speed);

  // 충돌 처리
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (isColliding(b, e)) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
      }
    });
  });

  // 플레이어 충돌
  enemies.forEach(e => {
    if (isColliding(player, e)) {
      gameOver = true;
    }
  });
}

// 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 총알
  ctx.fillStyle = "yellow";
  bullets.forEach(b =>
    ctx.fillRect(b.x, b.y, b.width, b.height)
  );

  // 적
  ctx.fillStyle = "red";
  enemies.forEach(e =>
    ctx.fillRect(e.x, e.y, e.width, e.height)
  );

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 80, 300);
  }
}

// 루프
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// 적 주기적 생성
setInterval(spawnEnemy, 1200);

// 시작
loop();
