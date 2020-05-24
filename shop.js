'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', Resize);

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

Resize();

let x, y;

window.onmousemove = function(event) {
  x = event.pageX;
  y = event.pageY;
}

const fon2 = new Image();
const money = new Image();
const health = new Image();
const antiseptic = new Image();
const masks = new Image();
const buyAntiseptic = new Image();
const buyMasks = new Image();
const buyPizza = new Image();
const increase = new Image();
const nextLevel = new Image();
const maskImage = new Image();
const pizzaImage = new Image();
const antImage = new Image();

money.src = 'Image/money.png';
health.src = 'Image/health.png';
antiseptic.src = 'Image/antiseptic.png';
masks.src = 'Image/masks.png';
buyAntiseptic.src = 'Image/buyAntiseptic.png';
buyMasks.src = 'Image/buyMasks.png';
buyPizza.src = 'Image/buyPizza.png';
increase.src = 'Image/increase.png';
nextLevel.src = 'Image/nextLevel.png';
maskImage.src = 'Image/maskImage.jpg';
pizzaImage.src = 'Image/pizzaImage.jpg';
antImage.src = 'Image/antImage.jpg';
fon2.src = 'Image/fon2.jpg';

fon2.onload = Draw;

const moneyCount = 500;
const healthCount = 90;
const healthVolume = 100;
const maskCount = 3;
const maskVolume = 5;
const antisepticCount = 10;
const antisepticVolume = 15;

const healthPrice = 10;
const healthVolumePrice = 20;
const maskPrice = 15;
const maskVolumePrice = 25;
const antisepticPrice = 5;
const antisepticVolumePrice = 15;

const rects = [];
const buttons = [];
const topRow = [];
const images  = [];
const lines = [];
const prices = [];

topRow.push(money, health, antiseptic, masks);

buttons.push(buyPizza, increase, buyAntiseptic, increase, buyMasks,
  increase, nextLevel);

images.push(pizzaImage, antImage, maskImage);

lines.push(moneyCount, healthCount, healthVolume, antisepticCount,
  antisepticVolume, maskCount, maskVolume);

prices.push(healthPrice, healthVolumePrice, antisepticPrice,
  antisepticVolumePrice, maskPrice, maskVolumePrice)

let moneyObj;

const rectLength = 250;

class TopRow {
  constructor(x, image, button1, button2) {
    //this.width = 250;
    //this.height = 100;
    this.x = x;
    this.y = 40;
    this.image = image;
    this.lineX = this.x + 165;
    this.lineY = this.y + 60;
    if (button2) {
      this.addOnes = button1;
      this.addVolume = button2;
      this.addOnes.obj = this;
      this.addVolume.obj = this;
    } else {
      this.parametr = button1;
    }

  }

  draw() {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      this.x, this.y, this.image.width, this.image.height);
  }

  drawLine() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    if (this.parametr >= 0) {
      ctx.fillText(this.parametr, this.lineX, this.lineY);
    } else {
      ctx.fillText(this.addOnes.parametr + '/' + this.addVolume.parametr,
        this.lineX, this.lineY);
    }

  }
}

class Buttons {
  constructor(x, y, image, parametr, price) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.parametr = parametr;
    this.price = price;
  }

  draw() {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      this.x, this.y, this.image.width, this.image.height);
  }

  increase() {
    this.parametr++;
  }
}

class Images {
  constructor(y, image) {
    this.image = image;
    this.x = canvas.width / 6;
    this.y = y;
  }

  draw() {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height,
      this.x, this.y, this.image.width, this.image.height);
  }
}

for (let j = 0, y = canvas.height / 3; j < 3; j++, y +=  100 + 60) {
  for (let i = 0, x = canvas.width / 3; i < 2; i++, x += rectLength + 40) {
    //console.log(buttons[rects.length - 4]);
    rects.push(new Buttons(x, y, buttons[rects.length],
      lines[rects.length + 1], prices[rects.length]));
  }
}



rects.push(new Buttons(canvas.width - rectLength - 40,
  canvas.height - 100 - 40, buttons[buttons.length - 1]));

for (let i = 0, x = 40, k = -2; i < topRow.length;
  i++, x += rectLength + 40, k += 2) {
  console.log('cccccccccc')
  if (k === -2) {
    rects.push(new TopRow(x, topRow[i], moneyCount));
    moneyObj = rects[rects.length - 1];
  } else {
    rects.push(new TopRow(x, topRow[i], rects[k], rects[k + 1]));
  }
}

for (let i = 0, y = canvas.height / 3; i < images.length; i++, y += 125 + 40) {
  rects.push(new Images(y, images[i]));
}

function Draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fon2, 0, 0, fon2.width, fon2.height,
    0, 0, canvas.width, canvas.height);

  for (const rect of rects) {
  //console.log(typeof rect.image);
    rect.draw();
    if (rect instanceof TopRow) {
      rect.drawLine();
    }
  }
}

document.addEventListener('click', clickHandler, false);

function clickHandler() {
  for (const rect of rects) {
    if (rect instanceof Buttons && x > rect.x &&
       x < rect.x + rect.image.width && y > rect.y &&
        y < rect.y + rect.image.height) {
      console.log('cdsacs');
      if (moneyObj.parametr - rect.price >= 0 && (rect === rect.obj.addOnes ?
        rect.obj.addOnes.parametr < rect.obj.addVolume.parametr : true)) {
        rect.increase();
        moneyObj.parametr -= rect.price;
        Draw();
        break;
      }
    }
  }
}

console.log(topRow);
console.log(rects);
console.log(buttons);
console.log(lines);

console.log(moneyObj);
