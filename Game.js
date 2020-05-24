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
const zombSH = new Image();

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
zombChild.src = 'Image/child.png';
zombSH.src = 'Image/ZombiSH.png';

let score = 0;

const moneyCount = 500;
const healthCount = 90;
const healthVolume = 100;
const maskCount = 3;
const maskVolume = 5;
const antisepticCount = 10;
const antisepticVolume = 15;

//let bonusCounter = 0;
//const bulletRange = 20;
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
  activeOnes: antisepticCount,
  maxCount: antisepticVolume,
}

const projector = {
  ones: bombs,
  activeOnes: maskCount,
  maxCount: maskVolume,
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

class ZombiSH extends Inficed {
  constructor(x, y) {
    super(x, y);
    this.image = zombSH;
  }
}

const level1 = [
  { addNewZomb: (x, y) => [new Inficed(x, y)], number: 4 },
  { addNewZomb: (x, y) => [new Alcoholic(x, y)], number: 3 },
  { addNewZomb: (x, y) => [new Mather(x, y)], number: 2 },
  { addNewZomb: (x, y) => [new ZombiSH(x, y),
    new ZombiSH(x + zombi.width * 0.4, y),
    new ZombiSH(x + zombi.width * 0.4 / 2, y - zombi.height * 0.4)],
  number: 1 }];

level1.count = 10;

class Bonus {
  constructor(x, y) {
    this.image = bonus;
    this.x = x;
    this.y = y;
    this.isDraw = true;
  }
}

class Bullet {
  constructor(x, y, isActive) {
    this.image = bullet;
    this.x = x;
    this.y = y;
    this.isDraw = false;
    this.isActive = isActive;
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
  constructor(...par) {
    super(...par);
    this.image = bomb;
  }
}

for (let i = 0; i < antisepticVolume; i++) {
  let isActive = false;
  if (i < antisepticCount) {
    isActive = true;
  }
  bullets.push(new Bullet(0, 0, isActive))
}

for (let i = 0; i < maskVolume; i++) {
  let isActive = false;
  if (i < maskCount) {
    isActive = true;
  }
  bombs.push(new Bomb(0, 0, isActive));
}


class Egg {
  constructor(x, y) {
    this.image = egg;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.isDraw = false;
    //this.isDead = false;
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
  health: healthCount,
  money: moneyCount,
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
    const newZombi = addZombi();
    if (newZombi) {
      zombies.push(...newZombi);
    }
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
  if (!level1.count && zombies.every(chekZombi)) {
    Stop();
  }
}

function chekZombi(zomb) {
  return !(zomb.isDraw)
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
  const numb = '' + RandomInteger(0, 3);
  const zombX = RandomInteger(30, canvas.width - 2 * zombi.width * 0.4);
  const zombY = RandomInteger(250, 400) * -1;
  console.log(numb);
  if (level1[numb].number) {
    console.log('dddddddddddd');
    level1[numb].number--
    level1.count--;
    return level1[numb].addNewZomb(zombX, zombY);
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

  bonusUpdate();
  zombiUpdate();
  weaponUpdate();
  const deadEgg = eggUpdate();



  if (deadZombi) {
    zombies.shift();
  }

  if (deadEgg) {
    eggs.shift();
  }

  drawScore();
  drawBulletPull();
  drawMoney();
  drawBombCount()
  drawHealth();

  if (rightPressed && Player.x < canvas.width - Player.image.width * 0.5) {
    Player.x += speedPlayer;

  } else if (leftPressed && Player.x > 0) {
    Player.x -= speedPlayer;
  }

  ctx.drawImage(player, 0, 0, player.width, player.height,
    Player.x, Player.y, player.width * 0.5, player.height * 0.5)

  requestAnimationFrame(Draw);
}
/*
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
}*/

function getBonus() {
  const prevBonus = Player.money;
  for (const bon of bonuses) {
    if (bon.isDraw && x > bon.x && x < bon.x + bon.image.width &&
      y > bon.y && y < bon.y + bon.image.height) {
      bon.isDraw = false;
      Player.money++;
      break;
    }
  }
  return (Player.money === prevBonus);
}

function ZombiAttak(zomb, index) {

  const timer1 = setInterval(() => {
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
      //eggs[index].isDead = true;
      clearInterval(timer1)
      //Не делать так zombies.shift();
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

  for (const [i, egg] of eggs.entries()) {
    if (egg.isDraw && egg.y > Player.y &&
      egg.y < Player.y + Player.image.height * 0.5 &&
       egg.x > Player.x && egg.x < Player.x + Player.image.width * 0.5) {
      if (Player.health === 0) {
        alert('Проиграш!');
      } else {
        Player.health -= 10;
        eggs[i].isDraw = false;
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
  ctx.fillText('Bullet: ' + gun.activeOnes + '/' + gun.maxCount, 8, 62);
}

function drawMoney() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Money: ' + Player.money, 8, 122);
}

function drawBombCount() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Bombs: ' + projector.activeOnes + '/' + projector.maxCount,
    8, 92);
}

function drawHealth() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Health: ' + Player.health + '/' + healthVolume, 8, 152);
}
