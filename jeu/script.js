
//-----------------------------SETUP-----------------------------//

//------------PLAYER------------//
playerThickness=80;                                                     //taille et skin du player et endroit de spawn//
playerX=240-playerThickness/2;                                          
playerHeight=10;
player = new Image(playerX,340,playerThickness,playerHeight);
player.src = 'player1.png';

//------------BALL------------//
ballSize=23;                                                            //taille, vitesse et skin de la balle et endroit de spawn//
ballX=ballY=50;
ball = new Image(ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
xVelocity=yVelocity=1;
ballArray = new Array();
ballArray[0] = 'lavaball1.png';
ballArray[1] = 'lavaball2.png';
ballArray[2] = 'lavaball3.png';
ballArray[3] = 'lavaball4.png';

//------------BOSS------------//
bossHp=1000;                                                            //hp et shield initial du boss et récupération//
bossShield = 0;                                                         //des différents id pour la barre d'hp et les stats hp et shield//
bossHpBar = document.getElementById('hpbar');                           //affichées au dessus du canvas//
bossHpState = document.getElementById('realhp');
bossHpDiv = document.getElementById('realhpnumber');
bossShieldDiv = document.getElementById('realshieldnumber');
bossHpBarWidth = 400;

//------------OFFSET------------//
canvasHitboxOffset = getComputedStyle(document.getElementById('offset')).getPropertyValue('width');                   //offset en calculant la moitié de la page html//
canvasTrueOffset = ((canvasHitboxOffset.slice(0, -2)-480) / 2);                                                       //moins le canvas pour que les controles par//
;                                                                                                                      //la souris soient correctement réglés//

//-----------------------------ONLOAD-----------------------------//

window.onload=function() {
  canvasGet=document.getElementById('monCanvas');
  canvas=canvasGet.getContext('2d');                                  //setup du canvas 2D//
  setInterval(update,300/60);                                         //taux de refresh 60 refresh par 300 ms pour les positions//
  setInterval(gifs,85/1);                                             //taux de refresh 1 refresh par 85 ms pour un effet de mouvement lent sur les textures//
  canvasGet.addEventListener('mousemove',function(e){                 //fonction de controle par la souris//
    playerX = (e.clientX-playerThickness/2)-canvasTrueOffset;
  });
}

//-----------------------------ONRESET-----------------------------//

function reset(){
  ballX=canvasGet.width/2;                                            //setup du spawn de la balle//
  ballY=canvasGet.height/2;
  rand = Math.floor(Math.random() * Math.floor(2));                   //randomization de la direction initiale de la balle//
  xVelocity = 1;                                                      //reset de la vitesse de la balle//
  if (rand==0) {
    xVelocity = -xVelocity
  }
  yVelocity=-1;
  syncHpBarPlus();
   if (bossHpBarWidth > 1 && bossHp > 1){                             //condition pour regen le boss a 100% hp lorsqu'on perd la balle (1000 hp)//
    bossHp = 1000;
  bossHpDiv.innerHTML = bossHp;
  bossShield=5;
  bossShieldDiv.innerHTML = bossShield;
  bossHpBarWidth = 400;
};
}

//-----------------------------ONREFRESH-----------------------------//

function gifs(){
  ball.src = ballArray[Math.floor(Math.random() * ballArray.length)];
}

function update(){
  canvasX = canvasGet.width;                                          //setup des positions du canvas en cas de mouvement et clear du background a chaque frame//
  canvasY = canvasGet.height;
  canvasbg = new Image();
  canvasbg.src = 'canvasbg.png';
  canvas.drawImage(canvasbg, 0, 0);
  if (bossHp <= 0) {                                                  //condition pour vérifier que le boss est toujours bien en vie//
    setTimeout(function(){
      yVelocity = 0;
      xVelocity = 0;
    },200);
  }
  ballX+=xVelocity;                                                   //ajout de la valeur de vélocité X et Y aux coordonnées X et Y //
  ballY+=yVelocity;                                                   //de la balle pour animer le déplacement//

  if(ballX>canvasX) {
    xVelocity=-xVelocity;
  }
  else if(ballY<0){                                                   //code lorsque la balle touche le coté supérieur du canvas//
    yVelocity=-yVelocity;
    if (bossShield == 0 && bossHpBarWidth > 1){                       //beaucoup de conditions pour vérifier l'état du boss, ses hp//
      bossHp-=100;  
      yVelocity+=0.5;                                                    //son shield et si il est encore en vie//
      syncHpBarMinus();
      if (bossHp <= 0) {
        bossHpState.innerHTML = 'DEAD';
        document.getElementById('boss').style.backgroundImage = 'url("deadboss.png")'
        return;
      } else {
        bossHpDiv.innerHTML = bossHp; };                                                    //code pour passer brièvement le boss en rouge//
        document.getElementById('boss').style.backgroundImage = 'url("oof.png")';           //lorsqu'il prend un coup de la balle//
        setTimeout(function() {
          document.getElementById('boss').style.backgroundImage = 'url("boss.gif")';
        },200);
      } else if (bossHpBarWidth > 1 && bossShield >= 1) {                                   //le shield du boss lui permet d'ignorer les dégats//
      bossShield--;
      bossShieldDiv.innerHTML = bossShield;
      yVelocity+=0.5;  
    }
  }
  else if (ballX<0) {
    xVelocity=-xVelocity;
  }
    else if (ballY>canvasY-25){                                                              //conditions si la balle rebondit sur le joueur//
      if (ballX>playerX && ballX<playerX+playerThickness){                                   //ou si elle rebondit sur le coté bas du canvas//
        yVelocity=-yVelocity;                                                                //ce qui aurait pour effet de lancer la fonction reset//
        deltaX = ballX-(playerX+playerThickness/2);
        xVelocity = deltaX*0.05;
      } else {
          ballX=canvasGet.width/2;                                            //setup du spawn de la balle//
          ballY=canvasGet.height/2;
          xVelocity = 0;
          yVelocity = 0;
          setTimeout(function(){
            reset();
          },800);
        }
      }
    canvas.fillStyle="rgba(0,0,0,0)";                                                         //mise a jour de la position du joueur, de la balle//
    canvas.fillRect(0,0,canvasGet.width,canvasGet.height);                                    //et clear du background//
    canvas.drawImage(player,playerX,330,playerThickness,playerHeight+7);
    canvas.drawImage(ball,ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
  }

  //-----------------------------FUNCTIONS-----------------------------//

  function syncHpBarPlus() {                                                                  //synchronisation entre les hp du boss et la barre de vie//
    if (bossHpBarWidth < 400 && bossHpBarWidth > 1){
      bossHpBarWidth += 80;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth > 400){
        bossHpBarWidth = 400;
        document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      }
    }
  }

  function syncHpBarMinus() {                                                                 //synchronisation entre les hp du boss et la barre de vie//
    if (bossHpBarWidth > 0){
      bossHpBarWidth -= 40;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth < 0)
        bossHpBarWidth = 0;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
    }
  }