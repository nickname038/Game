 let cvs = document.getElementById('canvas');
 let ctx = cvs.getContext('2d')
 const position = document.getElementById('position');

 Resize();
 window.addEventListener("resize", Resize);

 function Resize() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
 }

 let x = 0, y = 0;
 let sX, sY, k, dx, dy;
 let sXZ, sYZ, K, dxEgg, dyEgg;
let speedEgg = 4;



 window.onmousemove = function (event) {
   x = event.pageX;
   y = event.pageY;
   //console.log(x,y)
 }

 window.onclick = function () {
   sX = x - Player.x - Player.image.width*0.5*0.5;
   sY = y - Player.y;
   k = sX / sY;
   dy = -Math.sqrt(Math.pow(speedBullet, 2)/(1 + Math.pow(k, 2)));
   dx = (k * dy);
   if (Player.activeBullet) {
     Player.activeBullet--;
     for (let i = 0; i < bulletRange; i++) {
       if (Player.bullet[i].isActive) {
         Player.bullet[i].isActive = false;
         Player.bullet[i].isDraw = true;
         Player.bullet[i].x = Player.x + Player.image.width*0.5*0.5;
         Player.bullet[i].y = Player.y;
         Player.bullet[i].dx = dx;
         Player.bullet[i].dy = dy;
         console.dir(Player.bullet);
         break;
       }
     }
   }
   console.log(dx);
   console.log(dy);

 }

const egg = new Image();
const bullet = new Image();
const player = new Image();
const zombi = new Image();
//const fon = new Image();
const flat = new Image();

let zombies = [];
let bullets = [];
let eggs = [];

egg.src = "Image/egg1.png";
bullet.src = "Image/bullet1.png";
player.src = "Image/prog.jpg";
zombi.src = "Image/zombi.png";
//fon.src = "title.png";
flat.src = 'Image/k-18.jpg';

let score = 0;
let bulletRange = 20

let rightPressed = false;
let leftPressed = false;

let speedPlayer = 6;
let speedZombi = 2;
let speedBullet = 9;

const maxY = (canvas.height / 3) ;


class Inficed {
  constructor (image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.isDraw = true;
    this.isDead = false;
    this.eggY = RandomInteger(0, canvas.height);
    this.hasEgg = false;
  }

  Update() {
    if (this.y < maxY) {
      this.y += speedZombi;
    }

    if ((this.y > canvas.height - this.image.height*0.4) && this.isDraw === true) {
      Stop();
    }

    //if (this.y > this.eggY && this.hasEgg === false && this.isDraw === true) {
    if (this.y >= maxY && this.hasEgg === false && this.isDraw === true) {
      this.hasEgg = true;
    }
  }
}

class Bullet {
  constructor (image, x, y) {
    this.image = image;
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
      if (this.y < - 50) {
        this.isDead = true;
      }
  }
}

for (let i = 0; i < bulletRange; i++) {
  bullets.push(new Bullet(bullet, 0, 0 ))
}


class Egg {
  constructor (image, x, y) {
    this.image = image;
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

let Player = {
  x: canvas.width/2,
  y: canvas.height - 150,
  image: player,
  bullet: bullets,
  activeBullet: 20,
}

flat.onload = Draw;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function zombiUpdate () {
  if (RandomInteger(0, 10000) > 9900) {
    zombies.push(new Inficed(zombi, RandomInteger(30, canvas.width - zombi.width*0.4), RandomInteger(250, 400) * -1));
  }

  for (let i = 0; i < zombies.length; i++) {

    zombies[i].Update();

    if (zombies[i].hasEgg) {
      eggs.push(new Egg(egg, zombies[i].x +  zombies[i].image.width*0.4/2 ,zombies[i].y + zombies[i].image.height*0.4))
      let index = eggs.length - 1;
      console.log(index);
      //eggs[index].isDraw = false;
      ZombiAttak(zombies[i], index);
      /*(() => {
      eggs.push(new Egg(egg, zombies[i].x +  zombies[i].image.width*0.4/2 ,zombies[i].y + zombies[i].image.height*0.4))
      sXZ = (Player.x + Player.image.width*0.5*0.5) - zombies[i].x;
      sYZ = Player.y - zombies[i].y;
      K = sXZ / sYZ;
      dyEgg = Math.sqrt(Math.pow(speedEgg, 2)/(1 + Math.pow(K, 2)));
      dxEgg = (K * dyEgg);
      eggs[eggs.length - 1].x = zombies[i].x;
      eggs[eggs.length - 1].y = zombies[i].y;
      eggs[eggs.length - 1].dx = dxEgg;
      eggs[eggs.length - 1].dy = dyEgg;
      */
      zombies[i].hasEgg = undefined;
    //}, 3000)
    }

    if (zombies[i].isDead) {
      deadZombi = true;
    }

    if (zombies[i].isDraw) {
      ctx.drawImage(zombies[i].image, 0, 0, zombies[i].image.width, zombies[i].image.height,zombies[i].x, zombies[i].y, zombies[i].image.width*0.4, zombies[i].image.height*0.4)
    }
  }
}

function bulletUpdate () {
  for (let i = 0; i < bulletRange; i++) {



  /*  if (bullets[i].isDead) {
      deadBullet = true;
    }*/

    if (Player.bullet[i].isDraw) {
    Player.bullet[i].Update();
    ctx.drawImage(Player.bullet[i].image, 0, 0, Player.bullet[i].image.width, Player.bullet[i].image.height,Player.bullet[i].x, Player.bullet[i].y, Player.bullet[i].image.width, Player.bullet[i].image.height);

    }
  }
}




function eggUpdate() {
    for (let i = 0; i < eggs.length; i++) {
      if (eggs[i].isDraw){
        eggs[i].Update();
        ctx.drawImage(eggs[i].image, 0, 0, eggs[i].image.width, eggs[i].image.height,eggs[i].x, eggs[i].y, eggs[i].image.width, eggs[i].image.height)
      }
    }
}

function Draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(flat, 0, 0, flat.width,flat.height,0,0,canvas.width,canvas.height)

  collisionDetection();

  let deadZombi = false;
  //let deadBullet = false;
  let deadEgg = false;

  zombiUpdate();
  bulletUpdate();
  eggUpdate();

  if (deadZombi) {
    zombies.shift();
  }

  /*if (deadBullet) {
    bullets.shift();
  }*/

  if (deadEgg) {
    eggs.shift();
  }

  drawScore ();
  drawBulletPull();

  if(rightPressed && Player.x < canvas.width - Player.image.width*0.5) {
    Player.x += speedPlayer;

  } else if (leftPressed && Player.x > 0) {
    Player.x -= speedPlayer;
  }

  ctx.drawImage(player, 0, 0, player.width, player.height,Player.x,Player.y,player.width*0.5,player.height*0.5)

  requestAnimationFrame(Draw);
}

timer = setInterval(addBulets, 2000);

function addBulets () {
  if (Player.activeBullet < 20) {
    for (let i = 0; i < bulletRange; i++) {
      if (!Player.bullet[i].isActive && (Player.bullet[i].isDraw == false || Player.bullet[i].y < 50 || Player.bullet[i].x < -20 || Player.bullet[i].x > canvas.width + 20)) {
        Player.bullet[i].isActive = true;
        Player.activeBullet++;
        break;
      }
    }
  }
}

function ZombiAttak (zomb, index) {

  const timer = setInterval(() => {
  if (zomb.isDraw) {
    eggs[index].isDraw = true;
  sXZ = (Player.x + Player.image.width*0.5*0.5) - zomb.x;
  sYZ = Player.y - zomb.y;
  K = sXZ / sYZ;
  dyEgg = Math.sqrt(Math.pow(speedEgg, 2)/(1 + Math.pow(K, 2)));
  dxEgg = (K * dyEgg);
  eggs[index].x = zomb.x;
  eggs[index].y = zomb.y;
  eggs[index].dx = dxEgg;
  eggs[index].dy = dyEgg;
  //zomb.hasEgg = undefined;
  } else {
    clearInterval(timer)
  }
  }, 3000)
}

function RandomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 32) {
    if (Player.activeBullet) {
      Player.activeBullet--;
      for (let i = 0; i < bulletRange; i++) {
        if (Player.bullet[i].isActive) {
          Player.bullet[i].isActive = false;
          Player.bullet[i].isDraw = true;
          Player.bullet[i].x = Player.x + Player.image.width*0.5*0.5;
          Player.bullet[i].y = Player.y;
          console.dir(Player.bullet);
          break;
        }
      }
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let i = 0; i < bulletRange; i++) {
    for (let j = 0; j < zombies.length; j++) {

        if (Player.bullet[i].x > zombies[j].x && Player.bullet[i].x < zombies[j].x + zombies[j].image.width*0.4 && Player.bullet[i].y < zombies[j].y + zombies[j].image.height*0.4 && Player.bullet[i].isDraw && zombies[j].isDraw) {
          console.log(1);
        Player.bullet[i].isDraw = false;
        //Player.bullet[i].isActive = true;
        zombies[j].isDraw = false;
        //Player.activeBullet++;
        score += 4;
      }
    }
  }

  for (let i = 0; i < eggs.length; i++) {
    if (eggs[i].y > canvas.height - eggs[i].image.height && eggs[i].y < canvas.height && eggs[i].x > Player.x && eggs[i].x < Player.x + Player.image.width*0.5) {
      if (score < 60) {
        alert('Проиграш!');
      } else {
        score -= 10;
      }
    }
  }
}

function Stop () {
  alert(`Счет: ${score}`);
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+score, 8, 32);
}

function drawBulletPull() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Bullet: "+Player.activeBullet, 50, 70);
}
