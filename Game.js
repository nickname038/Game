'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();

let x, y;

window.onmousemove = function(event) {
  x = event.pageX;
  y = event.pageY;
}

const images = {};

images.egg = new Image();
images.bullet = new Image();
images.player = new Image();
images.zombi = new Image();
images.flat = new Image();
images.bonus = new Image();
images.zombiAlc = new Image();
images.bomb = new Image();
images.zombMam = new Image();
images.zombChild = new Image();
images.zombSH = new Image();

let zombies = [];
let eggs = [];
let bonuses = [];

images.egg.src = 'Image/egg1.png';
images.bullet.src = 'Image/bullet1.png';
images.player.src = 'Image/prog.jpg';
images.zombi.src = 'Image/zombi.png';
images.flat.src = 'Image/k-18.jpg';
images.bonus.src = 'Image/bonus.png';
images.zombiAlc.src = 'Image/zombiAlc.png';
images.bomb.src = 'Image/bomb.png';
images.zombMam.src = 'Image/mama.png';
images.zombChild.src = 'Image/child.png';
images.zombSH.src = 'Image/ZombiSH.png';

let level = 1;

const moneyCount = 500;
const healthCount = 90;
const healthVolume = 100;
const maskCount = 10;
const maskVolume = 10;
const antisepticCount = 20;
const antisepticVolume = 20;

let rightPressed = false;
let leftPressed = false;

const speedPlayer = 6;
const speedZombi = 2;
const speedBullet = 9;
const speedAngryZombi = 5;
const speedEgg = 4;

const timeAttak = 4000;
const angTimeAttak = 2000;

images.fon2 = new Image();
images.money = new Image();
images.health = new Image();
images.antiseptic = new Image();
images.masks = new Image();
images.buyAntiseptic = new Image();
images.buyMasks = new Image();
images.buyPizza = new Image();
images.increase = new Image();
images.nextLevel = new Image();
images.maskImage = new Image();
images.pizzaImage = new Image();
images.antImage = new Image();
images.winImage = new Image();
images.loseImage = new Image();

images.money.src = 'Image/money.png';
images.health.src = 'Image/health.png';
images.antiseptic.src = 'Image/antiseptic.png';
images.masks.src = 'Image/masks.png';
images.buyAntiseptic.src = 'Image/buyAntiseptic.png';
images.buyMasks.src = 'Image/buyMasks.png';
images.buyPizza.src = 'Image/buyPizza.png';
images.increase.src = 'Image/increase.png';
images.nextLevel.src = 'Image/nextLevel.png';
images.maskImage.src = 'Image/maskImage.jpg';
images.pizzaImage.src = 'Image/pizzaImage.jpg';
images.antImage.src = 'Image/antImage.jpg';
images.winImage.src = 'Image/winImage.jpg';
images.loseImage.src = 'Image/loseImage.png';
images.fon2.src = 'Image/fon2.jpg';

const healthPrice = 10;
const healthVolumePrice = 20;
const maskPrice = 15;
const maskVolumePrice = 25;
const antisepticPrice = 5;
const antisepticVolumePrice = 15;

const maxY = canvas.height / 3;
const imageX = canvas.width / 6;
const topRowY = 40;
const lineX = 165;
const lineY = 60;
const rectHeigth = 100;
const rectLength = 250;
const lineButtonNumber = 3;
const columnButtonNumber = 2;
const paddingY = 60;
const paddingX = 40;
const imageSize = 125;

const buttonX = canvas.width / 3;
const buttonY = canvas.height / 3;

const rects = {};
const buttons = [];
const topRow = [];
const shopImages  = [];
let lines = [];
const prices = [];
const rectsName = [];

const coordinatesOfButtonY = [];
const coordinatesOfButtonX = [];

let ID;

const keyCods = {
  enter: 13,
  right: 39,
  left: 37,
}

topRow.push(images.money, images.health, images.antiseptic, images.masks);

buttons.push(
  images.buyPizza, images.increase, images.buyAntiseptic, images.increase,
  images.buyMasks, images.increase, images.nextLevel
);

shopImages.push(images.pizzaImage, images.antImage, images.maskImage);

prices.push(
  healthPrice, healthVolumePrice, antisepticPrice,
  antisepticVolumePrice, maskPrice, maskVolumePrice
);

rectsName.push(
  'buyPizza', 'increasePizzaVolume', 'buyAntiseptic',
  'increaseAntisepticVolume', 'buyMasks', 'increaseMasksVolume',
  'nextLevelButton', 'moneyObj', 'healthObj', 'antisepticObj',
  'masksObj', 'pizzaImage', 'antImage', 'maskImage'
);

class Images {
  constructor(y, image) {
    this.image = image;
    this.x = imageX;
    this.y = y;
  }

  draw() {
    ctx.drawImage(
      this.image, 0, 0,
      this.image.width, this.image.height,
      this.x, this.y,
      this.image.width, this.image.height
    );
  }
}

class TopRow extends Images {
  constructor(x, image, button1, button2) {
    super(topRowY, image);
    this.x = x;
    this.lineX = this.x + lineX;
    this.lineY = this.y + lineY;
    if (button2) {
      this.addOnes = button1;
      this.addVolume = button2;
      this.addOnes.obj = this;
      this.addVolume.obj = this;
    } else {
      this.parametr = button1;
    }
  }

  drawLine() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    if (this.parametr >= 0) {
      ctx.fillText(`${this.parametr}`, this.lineX, this.lineY);
    } else {
      ctx.fillText(`${this.addOnes.parametr}/${this.addVolume.parametr}`,
        this.lineX, this.lineY);
    }
  }
}

class Buttons extends Images {
  constructor(x, y, image, parametr, price) {
    super(y, image);
    this.x = x;
    this.parametr = parametr;
    this.price = price;
  }

  increase() {
    this.parametr++;
  }

  get canIncrease() {
    if (this === this.obj.addVolume || (this === this.obj.addOnes &&
      this.parametr < this.obj.addVolume.parametr)) {
      return true;
    }
    return false;
  }
}

for (let i = 0; i < lineButtonNumber; i++) {
  coordinatesOfButtonY.push(buttonY + (rectHeigth + paddingY) * i);
}

for (let i = 0; i < columnButtonNumber; i++) {
  coordinatesOfButtonX.push(buttonX + (rectLength + paddingX) * i);
}

for (let i = 0; i < lineButtonNumber; i++) {
  const y = coordinatesOfButtonY[i];
  for (let j = 0; j < columnButtonNumber; j++) {
    const x = coordinatesOfButtonX[j];
    const index = Object.keys(rects).length;
    rects[rectsName[index]] = new Buttons(x, y, buttons[index],
      lines[index + 1], prices[index]);
  }
}

rects[rectsName[Object.keys(rects).length]] = new Buttons(
  canvas.width - rectLength - paddingX, canvas.height - rectHeigth - paddingY,
  buttons[buttons.length - 1]
);

rects[rectsName[Object.keys(rects).length]] = new TopRow(
  paddingX, topRow[0], moneyCount
);

for (let i = 1; i < topRow.length; i++) {
  const x = paddingX + (paddingX + rectLength) * i;
  const indexOfButton1 = (i - 1) * 2;
  const indexOfButton2 = indexOfButton1 + 1;
  const index = Object.keys(rects).length;
  rects[rectsName[index]] = new TopRow(
    x, topRow[i], rects[rectsName[indexOfButton1]],
    rects[rectsName[indexOfButton2]]
  );
}

for (let i = 0, y = buttonY; i < shopImages.length; i++,
y += imageSize + topRowY) {
  const index = Object.keys(rects).length;
  rects[rectsName[index]] = new Images(y, shopImages[i]);
}

const gun = {
  ones: [],
  activeOnes: antisepticCount,
  maxCount: antisepticVolume,
}

const projector = {
  ones: [],
  activeOnes: maskCount,
  maxCount: maskVolume,
}

class Inficed {
  constructor(x, y, image) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.isDraw = true;
    this.isDead = false;
    this.egg = null;
    this.hasBonus = randomInteger(0, 1000) > 500;
    this.speed = speedZombi;
    this.timeAttak = timeAttak;
  }

  update() {
    if (this.y < maxY) {
      this.y += this.speed;
    }
  }
}

class Alcoholic extends Inficed {}

class Children extends Inficed {
  constructor(x, y, image, mam) {
    super(x, y, image);
    this.mother = mam;
    this.isAngry = false;
  }
  update() {
    super.update();
    if (!this.mother.isDraw && this.speed === speedZombi) {
      this.isAngry = true;
      this.speed = speedAngryZombi;
    }
    if (this.isAngry && this.timeAttak === timeAttak) {
      this.timeAttak = angTimeAttak;
    }
  }
}

class Mather extends Inficed {
  constructor(...par) {
    super(...par);
    this.child = null;
  }

  update() {
    if (this.child) {
      super.update();
    } else {
      this.child = new Children(
        this.x + this.image.width, this.y, images.zombChild, this
      );
      zombies.push(this.child);
    }
  }
}

const addZombiFunctions = [
  (x, y) => [new Inficed(x, y, images.zombi)],
  (x, y) => [new Alcoholic(x, y, images.zombiAlc)],
  (x, y) => [new Mather(x, y, images.zombMam)],
  (x, y) => [new Inficed(x, y, images.zombSH),
    new Inficed(x + images.zombi.width, y, images.zombSH),
    new Inficed(
      x + images.zombi.width / 2,
      y - images.zombi.height, images.zombSH)
  ]
];

const level1 = [5, 0, 0, 0];
const level2 = [5, 5, 0, 0];
const level3 = [3, 3, 5, 0];
const level4 = [5, 5, 3, 5];

const sumOfZombi = level => level.reduce((acc, cur) => acc + cur, 0);

const levels = [level1, level2, level3, level4];

levels.map(level => level.count = sumOfZombi(level));

class Bonus {
  constructor(x, y) {
    this.image = images.bonus;
    this.x = x;
    this.y = y;
    this.isDraw = true;
  }
}

class Egg {
  constructor(x, y, image) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.dx;
    this.dy;
    this.isDraw = false;
  }

  update() {
    this.y += this.dy;
    this.x += this.dx;
  }
}

class Bullet extends Egg {
  constructor(x, y, image, isActive) {
    super(x, y, image);
    this.isActive = isActive;
  }

  update() {
    super.update();
    if (this.y < -50) {
      this.isDead = true;
    }
  }
}

class Bomb extends Bullet {}

for (let i = 0; i < antisepticVolume; i++) {
  gun.ones.push(new Bullet(0, 0, images.bullet, i < antisepticCount));
}

for (let i = 0; i < maskVolume; i++) {
  projector.ones.push(new Bomb(0, 0, images.bomb, i < maskCount));
}

const Player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  image: images.player,
  weapon: gun,
  health: healthCount,
  healthVolume,
  money: moneyCount,
  isInShop: false,
  level: levels[0],
}

images.flat.onload = draw;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('click', clickHandler, false);

function isInObj(obj1, x, y) {
  if (x > obj1.x && x < obj1.x + obj1.image.width &&
     y > obj1.y && y < obj1.y + obj1.image.height) {
    return true;
  }
  return false;
}

function drawShop() {
  Player.isInShop = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    images.fon2, 0, 0,
    images.fon2.width, images.fon2.height,
    0, 0,
    canvas.width, canvas.height
  );

  for (const rect of Object.values(rects)) {
    rect.draw();
    if (rect instanceof TopRow) {
      rect.drawLine();
    }
  }
}

function updateShop() {
  lines = [];
  lines.push(
    Player.health, Player.healthVolume, gun.activeOnes,
    gun.maxCount, projector.activeOnes, projector.maxCount
  );

  for (let i = 0; i < lines.length; i++) {
    const name = rectsName[i];
    rects[name].parametr = lines[i];
  }
}

function zombiUpdate() {
  if (randomInteger(0, 10000) > 9900) {
    const newZombi = addZombi();
    if (newZombi) {
      zombies.push(...newZombi);
    }
  }

  for (const zomb of zombies) {

    zomb.update();

    if (!zomb.egg && zomb.y >= maxY) {
      eggs.push(
        new Egg(zomb.x +  zomb.image.width / 2,
          zomb.y + zomb.image.height, images.egg)
      );
      zomb.egg = eggs[eggs.length - 1];
      zombiAttak(zomb);
    }

    if (zomb.isDraw) {
      ctx.drawImage(
        zomb.image, 0, 0,
        zomb.image.width, zomb.image.height,
        zomb.x, zomb.y, zomb.image.width,
        zomb.image.height
      );
    }
  }
}

function chekZombi(zomb) {
  return !zomb.isDraw;
}

function weaponUpdate() {
  for (const bul of gun.ones) {
    if (bul.isDraw) {
      bul.update();
      ctx.drawImage(
        bul.image, 0, 0,
        bul.image.width, bul.image.height,
        bul.x, bul.y,
        bul.image.width, bul.image.height
      );
    }
  }

  for (const bomb of projector.ones) {
    if (bomb.isDraw) {
      bomb.update();
      ctx.drawImage(
        bomb.image, 0, 0,
        bomb.image.width, bomb.image.height,
        bomb.x, bomb.y,
        bomb.image.width, bomb.image.height
      );
    }
  }
}

function bonusUpdate() {
  for (const bon of bonuses) {
    if (bon.isDraw) {
      ctx.drawImage(
        bon.image, 0, 0,
        bon.image.width, bon.image.height,
        bon.x, bon.y,
        bon.image.width, bon.image.height
      );
    }
  }
}

function addZombi() {
  const numb = randomInteger(0, 3);
  const zombX = randomInteger(30, canvas.width - 2 * images.zombi.width);
  const zombY = randomInteger(250, 400) * -1;
  if (Player.level[numb]) {
    Player.level[numb]--;
    Player.level.count--;
    return addZombiFunctions[numb](zombX, zombY);
  }
}

function eggUpdate() {
  for (const egg of eggs) {
    if (egg.isDraw) {
      egg.update();
      ctx.drawImage(
        egg.image, 0, 0,
        egg.image.width, egg.image.height,
        egg.x, egg.y,
        egg.image.width, egg.image.height
      );
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    images.flat, 0, 0,
    images.flat.width, images.flat.height,
    0, 0,
    canvas.width, canvas.height
  );

  const isLosed = collisionDetection();
  if (isLosed) {
    return;
  }

  bonusUpdate();
  zombiUpdate();
  weaponUpdate();
  eggUpdate();

  if (rightPressed && Player.x < canvas.width - Player.image.width) {
    Player.x += speedPlayer;

  } else if (leftPressed && Player.x > 0) {
    Player.x -= speedPlayer;
  }

  if (!Player.level.count && zombies.every(chekZombi)) {
    stop();
    return;
  }

  ctx.drawImage(
    Player.image, 0, 0,
    Player.image.width, Player.image.height,
    Player.x, Player.y,
    Player.image.width, Player.image.height
  );

  drawLevel();
  drawBulletPull();
  drawMoney();
  drawBombCount();
  drawHealth();

  ID = window.requestAnimationFrame(draw);
}

function determineDirection(x, y, obj, speed) {
  const sX = x - obj.x;
  const sY = y - obj.y;
  const k = sX / sY;
  let dy = Math.sqrt((speed ** 2) / (1 + (k ** 2)));
  if (sY < 0) {
    dy = -dy;
  }
  const dx = k * dy;
  return [dx, dy];
}

function zombiAttak(zomb) {

  const timer1 = setInterval(() => {
    if (zomb.isDraw) {
      zomb.egg.isDraw = true;
      const [dx, dy] = determineDirection(
        Player.x + Player.image.width * 0.5, Player.y, zomb, speedEgg
      );
      zomb.egg.x = zomb.x;
      zomb.egg.y = zomb.y;
      zomb.egg.dx = dx;
      zomb.egg.dy = dy;
    } else {
      clearInterval(timer1)
    }
  }, zomb.timeAttak)
}

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function keyDownHandler(e) {
  if (e.keyCode === keyCods.right) {
    rightPressed = true;
  } else if (e.keyCode === keyCods.left) {
    leftPressed = true;
  } else if (e.keyCode === keyCods.enter) {
    if (Player.weapon === gun) {
      Player.weapon = projector;
    } else {
      Player.weapon = gun;
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode === keyCods.right) {
    rightPressed = false;
  } else if (e.keyCode === keyCods.left) {
    leftPressed = false;
  }
}

function clickHandler() {
  if (Player.isInShop) {
    clickButton();
  } else if (getBonus()) {
    const [dx, dy] = determineDirection(x, y, Player, speedBullet);
    if (Player.weapon.activeOnes) {
      Player.weapon.activeOnes--;
      for (const bul of Player.weapon.ones) {
        if (bul.isActive) {
          bul.isActive = false;
          bul.isDraw = true;
          bul.x = Player.x + Player.image.width * 0.5;
          bul.y = Player.y;
          bul.dx = dx;
          bul.dy = dy;
          break;
        }
      }
    }
  }
}

function clickButton() {
  for (const rect of Object.values(rects)) {
    const isCursorInObj = isInObj(rect, x, y);
    if (rect instanceof Buttons && isCursorInObj) {
      if (rects.moneyObj.parametr - rect.price >= 0 && rect.canIncrease) {
        rect.increase();
        rects.moneyObj.parametr -= rect.price;
        drawShop();
        break;
      } else if (rect === rects.nextLevelButton) {
        const index = levels.indexOf(Player.level) + 1;
        if (levels[index]) {
          Player.level = levels[index];
          Player.isInShop = false;
          initLevel();
          draw();
        }
      }
    }
  }
}

function getBonus() {
  const prevBonus = Player.money;
  for (const bon of bonuses) {
    const isCursorInObj = isInObj(bon, x, y);
    if (bon.isDraw && isCursorInObj) {
      bon.isDraw = false;
      Player.money++;
      break;
    }
  }
  return (Player.money === prevBonus);
}

function collisionZombiWeapon(weapon) {
  for (const bul of weapon) {
    for (const zomb of zombies) {
      const isBulInZomb = isInObj(zomb, bul.x, bul.y);
      if (isBulInZomb && bul.isDraw && zomb.isDraw) {
        if (Player.weapon === gun && zomb instanceof Alcoholic) {
          continue;
        } else if (zomb instanceof Children && zomb.mother.isDraw) {
          bul.isDraw = false;
          zomb.mother.isDraw = false;
          if (zomb.mother.hasBonus) {
            bonuses.push(new Bonus(zomb.x, zomb.y));
          }
        } else {
          bul.isDraw = false;
          zomb.isDraw = false;
          if (zomb.hasBonus) {
            bonuses.push(new Bonus(zomb.x, zomb.y));
          }
        }
      }
    }
  }
}

function collisionDetection() {

  collisionZombiWeapon(gun.ones);
  collisionZombiWeapon(projector.ones);

  for (const [i, egg] of eggs.entries()) {
    const isEggInPlayer = isInObj(Player, egg.x, egg.y);
    if (egg.isDraw && isEggInPlayer) {
      if (Player.health <= 0) {
        window.cancelAnimationFrame(ID);
        ctx.drawImage(
          images.loseImage, 0, 0,
          images.loseImage.width, images.loseImage.height,
          0, 0,
          canvas.width, canvas.height
        );
        setTimeout(() => alert('Проигрыш! Ви инфицированы('), 0);
        return true;
      } else {
        Player.health -= 10;
        eggs[i].isDraw = false;
      }
    }
  }
  return false;
}

function stop() {
  window.cancelAnimationFrame(ID);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (levels[levels.indexOf(Player.level) + 1]) {
    updateShop();
    drawShop();
  } else {
    ctx.drawImage(
      images.winImage, 0, 0,
      images.winImage.width, images.winImage.height,
      0, 0,
      canvas.width, canvas.height
    );
    setTimeout(() => {
      alert('Поздравляю! Вы спасли Землю! Ура, карантин наконец-то закончился');
    }, 0);
  }
}

function initLevel() {
  clearLevel();
  Player.money = rects.moneyObj.parametr;
  Player.health = rects.buyPizza.parametr;
  Player.healthVolume = rects.increasePizzaVolume.parametr;
  gun.activeOnes = rects.buyAntiseptic.parametr;
  gun.maxCount = rects.increaseAntisepticVolume.parametr;

  projector.activeOnes = rects.buyMasks.parametr;
  projector.maxCount = rects.increaseMasksVolume.parametr;

  for (let i = 0; i < gun.maxCount; i++) {
    gun.ones.push(new Bullet(0, 0, images.bullet, i < gun.activeOnes));
  }

  for (let i = 0; i < projector.maxCount; i++) {
    projector.ones.push(new Bomb(0, 0, images.bomb, i < projector.activeOnes));
  }

}

function clearLevel() {
  level++;
  gun.ones = [];
  projector.ones = [];
  zombies = [];
  eggs = [];
  bonuses = [];
}

function drawLevel() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText(`Level: ${level}`, 8, 32);
}

function drawBulletPull() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  const { activeOnes, maxCount } = gun;
  ctx.fillText(`Bullet: ${activeOnes}/${maxCount}`, 8, 62);
}

function drawMoney() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Money: ${Player.money}`, 8, 122);
}

function drawBombCount() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  const { activeOnes, maxCount } = projector;
  ctx.fillText(`Bombs: ${activeOnes}/${maxCount}`,
    8, 92);
}

function drawHealth() {
  ctx.font = '32px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Health: ${Player.health}/${Player.healthVolume}`, 8, 152);
}
