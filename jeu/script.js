
//-----------------------------SETUP-----------------------------//
IA = 1;
Over = 0;

//------------PLAYER------------//
playerThickness=80;                                                    
playerX=240-playerThickness/2;                                          
playerHeight=10;
player = new Image(playerX,340,playerThickness,playerHeight);
player.src = 'player1.png';

//------------BALL------------//
ballSize=23;                                                           
ballX=ballY=50;
ball = new Image(ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
xVelocity=yVelocity=0;
setTimeout(function(){
  xVelocity=yVelocity=1;
},2000);
ballArray = new Array();
ballArray[0] = 'lavaball1.png';
ballArray[1] = 'lavaball2.png';
ballArray[2] = 'lavaball3.png';
ballArray[3] = 'lavaball4.png';

//------------BOSS------------//
bossHp=1000;                                                           
bossShield = 0;                                                       
bossHpBar = document.getElementById('hpbar');                          
bossHpState = document.getElementById('realhp');
bossHpDiv = document.getElementById('realhpnumber');
bossShieldDiv = document.getElementById('realshieldnumber');
bossHpBarWidth = 400;
bossProtecSpawn = 0;                                                                                                                   

//-----------------------------ONLOAD-----------------------------//

window.onload=function() {
  canvasGet=document.getElementById('monCanvas');
  canvas=canvasGet.getContext('2d');                                 
  setInterval(update,300/60);                                         
  setInterval(gifs,85/1);  
  if (IA == 0) {                                           
    canvasGet.addEventListener('mousemove',function(e){                
      playerX = (e.clientX-playerThickness/2)-canvasTrueOffset;
    });}
  }

  //------------OFFSET------------//
canvasHitboxOffset = getComputedStyle(document.getElementById('offset')).getPropertyValue('width');                  
canvasTrueOffset = ((canvasHitboxOffset.slice(0, -2)-480) / 2);                                                       
victoryOffset = ((canvasHitboxOffset.slice(0, -2)/ 2)- 140);  

//-----------------------------ONRESET-----------------------------//

function reset(){
  ballX=canvasGet.width/2;                                           
  ballY=canvasGet.height/2;
  rand = Math.floor(Math.random() * Math.floor(2));                  
  xVelocity = 1;                                                     
  if (rand==0) {
    xVelocity = -xVelocity
  }
  yVelocity=-1;
  syncHpBarPlus();
  if (bossHpBarWidth > 1 && bossHp > 1){                           
    bossHp = 1000;
    bossHpDiv.innerHTML = bossHp;
    bossShield=5;
    bossShieldDiv.innerHTML = bossShield;
    bossHpBarWidth = 400;
    bossProtecSpawn = 1;
  };
}

//-----------------------------ONREFRESH-----------------------------//

function gifs(){
  ball.src = ballArray[Math.floor(Math.random() * ballArray.length)];
}



function update(){
  canvasX = canvasGet.width;                                         
  canvasY = canvasGet.height;
  canvasbg = new Image();
  canvasbg.src = 'canvasbg.png';
  canvas.drawImage(canvasbg, 0, 0);
  ballX+=xVelocity;                                                 
  ballY+=yVelocity;                                                  

  if(ballX>canvasX) {
    xVelocity=-xVelocity;
  }
  else if(ballY<0){                                                
    yVelocity=-yVelocity;
    if (bossProtecSpawn == 1) {
      bossProtecSpawn = 0;
    } else if (bossShield == 1) {
      yVelocity = 1;
      bossShield--;
      bossShieldDiv.innerHTML = bossShield;
    } else if (bossShield == 0 && bossHpBarWidth > 40){             
      bossHp-=100;  
      document.getElementById('hp100').style.display = "block"; 
      document.getElementById('hp100').style.top = "20px";
      document.getElementById('hp100').style.left ="40px"; 
      setTimeout(function(){
        document.getElementById('hp100').style.display = "none";
      },250);
      yVelocity+=0.5;                                                    
      syncHpBarMinus();
      bossHpDiv.innerHTML = bossHp; 
    } else if (bossHp == 100) {
      syncHpBarMinus();
      bossHpState.innerHTML = 'DEAD';
      document.getElementById('boss').style.backgroundImage = 'url("deadboss.png")'; 
      if (Over == 0) {
        xVelocity = 0;
        yVelocity = 0;
        document.getElementById('victoire').style.display = "block";
        document.getElementById('victoire').style.left = victoryOffset+"px";
        document.getElementById('hpbar').style.border = '0px';
        ballSize = 0;
        document.getElementById('boss').style.marginTop = "10px";
      Over++;
    }
    } else if (bossHpBarWidth > 1 && bossShield >= 1) {                                
      bossShield--;
      bossShieldDiv.innerHTML = bossShield;
      yVelocity+=0.5;  
      document.getElementById('shield1').style.display = "block"; 
      document.getElementById('shield1').style.top = "20px";
      document.getElementById('shield1').style.left = "40px"; 
      setTimeout(function(){
        document.getElementById('shield1').style.display = "none";
      },250);
    }
  }
  else if (ballX<0) {
    xVelocity=-xVelocity;
  }
  else if (ballY>canvasY-25){                                                         
    if (ballX>playerX && ballX<playerX+playerThickness){                               
      yVelocity=-yVelocity;                                                         
      deltaX = ballX-(playerX+playerThickness/2);
      xVelocity = deltaX*0.05;
    } else {
      ballX=canvasGet.width/2;                                        
      ballY=canvasGet.height/2;
      xVelocity = 0;
      yVelocity = 0;
      setTimeout(function(){
        reset();
      },800);
    }
  }
  canvas.fillStyle="rgba(0,0,0,0)";                                                    
  canvas.fillRect(0,0,canvasGet.width,canvasGet.height);     
  if (IA == 0) {                            
    canvas.drawImage(player,playerX,330,playerThickness,playerHeight+7);
  }
  else if (IA == 1) {
    playerX = ballX-(playerThickness/2);
    canvas.drawImage(player,playerX,330,playerThickness,playerHeight+7);
  }
  canvas.drawImage(ball,ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
}

  //-----------------------------FUNCTIONS-----------------------------//

  function syncHpBarPlus() {                                                               
    if (bossHpBarWidth < 400 && bossHpBarWidth > 1){
      bossHpBarWidth += 80;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth > 400){
        bossHpBarWidth = 400;
        document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      }
    }
  }

  function syncHpBarMinus() {                                                              
    if (bossHpBarWidth > 0){
      bossHpBarWidth -= 40;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth < 0)
        bossHpBarWidth = 0;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
    }
  }