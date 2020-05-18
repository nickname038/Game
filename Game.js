'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', Resize);

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

Resize();

let x = 0, y = 0;
let sX, sY, k, dx, dy;
let sXZ, sYZ, K, dxEgg, dyEgg;
const speedEgg = 4;

window.onmousemove = function(event) {
  x = event.pageX;
  y = event.pageY;
}

const egg = new Image();
const bullet = new Image();
const player = new Image();
const zombi = new Image();
const flat = new Image();
const bonus = new Image();
const zombiAlc = new Image();
const bomb = new Image();
const zombMam = new Image();
const zombChild = new Image();

const zombies = [];
const bullets = [];
const eggs = [];
const bonuses = [];
const bombs = [];

egg.src = 'Image/egg1.png';
bullet.src = 'Image/bullet1.png';
player.src = 'Image/prog.jpg';
zombi.src = 'Image/zombi.png';
flat.src = 'Image/k-18.jpg';
bonus.src = 'Image/bonus.jpg';
zombiAlc.src = 'Image/zombiAlc.png';
bomb.src = 'Image/bomb.png';
zombMam.src = 'Image/mama.png';
zombChild.src = 'Image/child.png'

let score = 0;
let bonusCounter = 0;
const bulletRange = 20;
const bombRange = 5;

let rightPressed = false;
let leftPressed = false;

const speedPlayer = 6;
const speedZombi = 2;
const speedBullet = 9;
const speedAngryZombi = 5;

const timeAttak = 4000;
const angTimeAttak = 2000;

const gun = {
  ones: bullets,
  activeOnes: bulletRange,
  maxCount: bulletRange,
}

const projector = {
  ones: bombs,
  activeOnes: bombRange,
  maxCount: bombRange,
}

const maxY = (canvas.height / 3);

class Inficed {
  constructor(x, y) {
    this.image = zombi;
    this.x = x;
    this.y = y;
    this.isDraw = true;
    this.isDead = false;
    //this.eggY = RandomInteger(0, canvas.height);
    this.hasEgg = false;
    this.hasBonus = RandomInteger(0, 1000) > 500
    this.speed = speedZombi;
    this.timeAttak = timeAttak;
  }

  Update() {
    if (this.y < maxY) {
      this.y += this.speed;
    }

    if ((this.y > canvas.height - this.image.height * 0.4) &&
     this.isDraw === true) {
      Stop();
    }

    if (this.y >= maxY && this.hasEgg === false && this.isDraw === true) {
      this.hasEgg = true;
    }
  }
}

class Alcoholic extends Inficed {
  constructor(x, y) {
    super(x, y);
    this.image = zombiAlc;
  }

}

class Children extends Inficed {
  constructor(x, y, mam) {
    super(x, y);
    this.image = zombChild;
    this.mother = mam;
    this.isAngry = false;
  }
  Update() {
    super.Update();
    if (!(this.mother.isDraw) && this.speed === speedZombi) {
      this.isAngry = true;
      this.speed = speedAngryZombi;
    }
    if (this.isAngry && this.timeAttak === timeAttak) {
      this.timeAttak = angTimeAttak;
    }
  }
}

class Mather extends Inficed {
  constructor(x, y) {
    super(x, y);
    this.image = zombMam;
    this.child = null;
  }

  Update() {
    if (this.child) {
      super.Update();
    } else {
      this.child = new Children(this.x + zombMam.width * 0.4, this.y, this);
      zombies.push(this.child);
    }
  }
}

class Bonus {
  constructor(x, y) {
    this.image = bonus;
    this.x = x;
    this.y = y;
    this.isDraw = true;
  }
}

class Bullet {
  constructor(x, y) {
    this.image = bullet;
    this.x = x;
    this.y = y;
    this.isDraw = false;
    this.isActive = true;
    this.dx;
    this.dy;
  }

  Update() {
    this.y += this.dy;
    this.x += this.dx;
    if (this.y < -50) {
      this.isDead = true;
    }
  }
}

class Bomb extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.image = bomb;
  }
}

for (let i = 0; i < bulletRange; i++) {
  bullets.push(new Bullet(0, 0))
}

for (let i = 0; i < bombRange; i++) {
  bombs.push(new Bomb(0, 0))
}


class Egg {
  constructor(x, y) {
    this.image = egg;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.isDraw = false;
  }

  Update() {
    this.y += this.dy;
    this.x += this.dx;
  }
}

const Player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  image: player,
  weapon: gun,
  //bombs: bombs,
  //activeBombs: bombRange,
}

flat.onload = Draw;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
//document.addEventListener('oncontextmenu', oncontextmenuHandler, false);
document.addEventListener('click', clickHandler, false);


function zombiUpdate() {
  if (RandomInteger(0, 10000) > 9950) {
    zombies.push(...addZombi());
  }

  for (const zomb of zombies) {

    zomb.Update();

    if (zomb.hasEgg) {
      eggs.push(new Egg(zomb.x +  zomb.image.width * 0.4 / 2,
        zomb.y + zomb.image.height * 0.4))
      const index = eggs.length - 1;
      ZombiAttak(zomb, index);
      zomb.hasEgg = undefined;
    }

    if (zomb.isDraw) {
      ctx.drawImage(zomb.image, 0, 0, zomb.image.width, zomb.image.height,
        zomb.x, zomb.y, zomb.image.width * 0.4, zomb.image.height * 0.4)
    }
  }
}

function weaponUpdate() {
  for (const bul of bullets) {
    if (bul.isDraw) {
      bul.Update();
      ctx.drawImage(bul.image, 0, 0, bul.image.width, bul.image.height,
        bul.x, bul.y, bul.image.width, bul.image.height);
    }
  }

  for (const bomb of bombs) {
    if (bomb.isDraw) {
      bomb.Update();
      ctx.drawImage(bomb.image, 0, 0, bomb.image.width, bomb.image.height,
        bomb.x, bomb.y, bomb.image.width, bomb.image.height);
    }
  }
}

function bonusUpdate() {
  for (const bon of bonuses) {
    if (bon.isDraw) {
      ctx.drawImage(bon.image, 0, 0, bon.image.width, bon.image.height,
        bon.x, bon.y, bon.image.width, bon.image.height)
    }
  }
}

function addZombi() {
  const numb = RandomInteger(0, 1000);
  const zombX = RandomInteger(30, canvas.width - 2 * zombi.width * 0.4);
  const zombY = RandomInteger(250, 400) * -1;
  if (numb < 400) {
    return [new Inficed(zombX, zombY)];
  } else if (numb < 700) {
    return [new Alcoholic(zombX, zombY)];
  } else {
    return [new Mather(zombX, zombY)];
  }
}

function eggUpdate() {
  for (const egg of eggs) {
    if (egg.isDraw) {
      egg.Update();
      ctx.drawImage(egg.image, 0, 0, egg.image.width, egg.image.height,
        egg.x, egg.y, egg.image.width, egg.image.height)
    }
  }
}

function Draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(flat, 0, 0, flat.width, flat.height,
    0, 0, canvas.width, canvas.height)

  collisionDetection();

  const deadZombi = false;
  const deadEgg = false;

  bonusUpdate();
  zombiUpdate();
  weaponUpdate();
  eggUpdate();


  if (deadZombi) {
    zombies.shift();
  }

  if (deadEgg) {
    eggs.shift();
  }

  drawScore();
  drawBulletPull();
  drawBonusCount();
  drawBombCount()

  if (rightPressed && Player.x < canvas.width - Player.image.width * 0.5) {
    Player.x += speedPlayer;

  } else if (leftPressed && Player.x > 0) {
    Player.x -= speedPlayer;
  }

  ctx.drawImage(player, 0, 0, player.width, player.height,
    Player.x, Player.y, player.width * 0.5, player.height * 0.5)

  requestAnimationFrame(Draw);
}

const timer = setInterval(addBulets, 2000);

function addBulets() {
  if (Player.weapon.activeOnes < Player.weapon.maxCount) {
    for (const bul of Player.weapon.ones) {
      if (!bul.isActive && (bul.isDraw === false || bul.y < 50 ||
         bul.x < -20 || bul.x > canvas.width + 20)) {
        bul.isActive = true;
        Player.weapon.activeOnes++;
        break;
      }
    }
  }
}

function getBonus() {
  const prevBonus = bonusCounter;
  for (const bon of bonuses) {
    if (bon.isDraw && x > bon.x && x < bon.x + bon.image.width &&
      y > bon.y && y < bon.y + bon.image.height) {
      bon.isDraw = false;
      bonusCounter++;
      break;
    }
  }
  return (bonusCounter === prevBonus);
}

function ZombiAttak(zomb, index) {

  const timer = setInterval(() => {
    if (zomb.isDraw) {
      eggs[index].isDraw = true;
      sXZ = (Player.x + Player.image.width * 0.5 * 0.5) - zomb.x;
      sYZ = Player.y - zomb.y;
      K = sXZ / sYZ;
      dyEgg = Math.sqrt((speedEgg ** 2) / (1 + (K ** 2)));
      dxEgg = (K * dyEgg);
      eggs[index].x = zomb.x;
      eggs[index].y = zomb.y;
      eggs[index].dx = dxEgg;
      eggs[index].dy = dyEgg;
    } else {
      clearInterval(timer)
    }
  }, zomb.timeAttak)
}

function RandomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  } else if (e.keyCode === 13) {
    if (Player.weapon === gun) {
      Player.weapon = projector;
    } else {
      Player.weapon = gun;
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function clickHandler() {
  if (getBonus()) {
    sX = x - Player.x - Player.image.width * 0.5 * 0.5;
    sY = y - Player.y;
    k = sX / sY;
    dy = -Math.sqrt((speedBullet ** 2) / (1 + k ** 2));
    dx = (k * dy);
    if (Player.weapon.activeOnes) {
      Player.weapon.activeOnes--;
      for (const bul of Player.weapon.ones) {
        if (bul.isActive) {
          bul.isActive = false;
          bul.isDraw = true;
          bul.x = Player.x + Player.image.width * 0.5 * 0.5;
          bul.y = Player.y;
          bul.dx = dx;
          bul.dy = dy;
          break;
        }
      }
    }
  }
}

function collisionZombiWeapon(weapon) {
  for (const bul of weapon) {
    for (const zomb of zombies) {
      if (bul.x > zomb.x && bul.x < zomb.x + zomb.image.width * 0.4 &&
        bul.y < zomb.y + zomb.image.height * 0.4 && bul.isDraw && zomb.isDraw) {
        if (weapon === bullets && zomb instanceof Alcoholic) {
          continue;
        } else if (zomb instanceof Children && zomb.mother.isDraw) {
          bul.isDraw = false;
          zomb.mother.isDraw = false;
          score += 4;
          if (zomb.mother.hasBonus) {
            bonuses.push(new Bonus(zomb.x, zomb.y));
          }
        } else {
          bul.isDraw = false;
          zomb.isDraw = false;
          score += 4;
          if (zomb.hasBonus) {
            bonuses.push(new Bonus(zomb.x, zomb.y));
          }
        }
      }
    }
  }
}


function collisionDetection() {

  collisionZombiWeapon(bullets);
  collisionZombiWeapon(bombs);

  for (const egg of eggs) {
    if (egg.y > Player.y && egg.y < Player.y + Player.image.height * 0.5 &&
       egg.x > Player.x && egg.x < Player.x + Player.image.width * 0.5) {
      if (score < 60) {
        alert('Проиграш!');
      } else {
        score -= 10;
      }
    }
  }
}

function Stop() {
  alert(`Счет: ${score}`);
}

function drawScore() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 8, 32);
}

function drawBulletPull() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Bullet: ' + gun.activeOnes, 8, 62);
}

function drawBonusCount() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Bonus: ' + bonusCounter, 8, 122);
}

function drawBombCount() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Bombs: ' + projector.activeOnes, 8, 92);
}
