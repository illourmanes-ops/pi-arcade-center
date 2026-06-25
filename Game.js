// ==========================================
// PI ARCADE CENTER - JEUX
// ==========================================

// Init Pi SDK
try { Pi.init({version:"2.0",sandbox:true}); } catch(e) {}

// Données globales
let pts = parseInt(localStorage.getItem('pac_pts')||'0');
let lvl = Math.floor(pts/500)+1;
let achv = Math.floor(pts/100);
let chatMessages = JSON.parse(localStorage.getItem('pac_chat')||'[]');
let intervals = {};

// Toast
function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast show';
    setTimeout(() => t.className = 'toast', 2000);
}

// Ajouter points
function addPts(amount) {
    pts += amount;
    lvl = Math.floor(pts/500)+1;
    achv = Math.floor(pts/100);
    localStorage.setItem('pac_pts', pts);
    document.getElementById('ptsDisplay').textContent = pts;
    document.getElementById('lvlDisplay').textContent = lvl;
    document.getElementById('achvDisplay').textContent = achv;
    updateLeaderboard();
}

// Sauvegarde
function saveAll() {
    localStorage.setItem('pac_pts', pts);
    localStorage.setItem('pac_chat', JSON.stringify(chatMessages.slice(-50)));
}

// Ouvrir/Fermer jeu
function openGame(game) {
    const modal = document.getElementById('modal'+game.charAt(0).toUpperCase()+game.slice(1));
    if (modal) modal.classList.add('show');
    if (game==='runner') startRunner();
    if (game==='invaders') startInvaders();
    if (game==='snake') startSnake();
    if (game==='breakout') startBreakout();
    if (game==='flappy') startFlappy();
    if (game==='platformer') startPlatformer();
    if (game==='basket') drawBasket();
    if (game==='football') drawFootball();
    if (game==='bowling') drawBowling();
    if (game==='darts') drawDarts();
    if (game==='boxing') startBoxing();
    if (game==='golf') drawGolf();
    if (game==='2048') start2048();
    if (game==='memory') startMemory();
    if (game==='wordle') startWordle();
    if (game==='mines') startMines();
    if (game==='colorMatch') startColorMatch();
    if (game==='puzzle') startPuzzle();
    if (game==='whack') initWhack();
    if (game==='precision') startPrecision();
    if (game==='chat') renderChat();
    if (game==='leaderboard') updateLeaderboard();
    if (game==='wheel') drawWheel();
}

function closeGame(game) {
    document.getElementById('modal'+game.charAt(0).toUpperCase()+game.slice(1)).classList.remove('show');
    Object.keys(intervals).forEach(k => { clearInterval(intervals[k]); delete intervals[k]; });
}

// ============ CHAT ============
function renderChat() {
    document.getElementById('chatMessages').innerHTML = chatMessages.map(m => 
        '<div style="padding:3px;font-size:11px"><strong>'+m.user+':</strong> '+m.text+'</div>'
    ).join('');
}
function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (text) {
        chatMessages.push({user:'Joueur_'+Math.random().toString(36).substr(2,4), text:text, time:Date.now()});
        input.value = '';
        saveAll();
        renderChat();
    }
}

// ============ LEADERBOARD ============
function updateLeaderboard() {
    const list = [
        {name:'Vous', pts:pts}, {name:'ProGamer', pts:4500}, {name:'PiKing', pts:3800},
        {name:'ArcadeMaster', pts:3200}, {name:'LuckyPlayer', pts:2900}, {name:'StarChamp', pts:2500},
        {name:'GameWizard', pts:2100}, {name:'PixelHero', pts:1800}, {name:'CoinMaster', pts:1500},
        {name:'TopScore', pts:1200}
    ].sort((a,b)=>b.pts-a.pts);
    
    document.getElementById('leaderboardList').innerHTML = list.map((p,i) => {
        let cls = 'leaderboard-item';
        if (i===0) cls += ' top1';
        return '<div class="'+cls+'"><span>'+(i+1)+'. '+p.name+'</span><span>'+p.pts+' pts</span></div>';
    }).join('');
}

// ============ RUNNER ============
let runnerY=150, runnerVY=0, runnerScore=0, runnerObstacles=[];
function startRunner() {
    runnerScore=0; runnerY=150; runnerVY=0;
    runnerObstacles=[{x:350,y:170,w:20,h:30}];
    document.getElementById('runnerScore').textContent='0';
    const canvas=document.getElementById('canvasRunner'), ctx=canvas.getContext('2d');
    clearInterval(intervals.runner);
    intervals.runner=setInterval(()=>{
        runnerVY+=0.5; runnerY+=runnerVY;
        if(runnerY>150){runnerY=150;runnerVY=0;}
        runnerObstacles.forEach(o=>o.x-=3);
        if(runnerObstacles[runnerObstacles.length-1].x<250) runnerObstacles.push({x:380,y:170,w:20,h:25+Math.random()*25});
        runnerObstacles=runnerObstacles.filter(o=>o.x>-30);
        const p={x:50,y:runnerY,w:25,h:25};
        runnerObstacles.forEach(o=>{if(p.x<o.x+o.w&&p.x+p.w>o.x&&p.y<o.y+o.h&&p.y+p.h>o.y){clearInterval(intervals.runner);addPts(runnerScore);toast('🏃 +'+runnerScore+' pts');}});
        runnerScore++;
        document.getElementById('runnerScore').textContent=runnerScore;
        ctx.fillStyle='#000';ctx.fillRect(0,0,350,200);
        ctx.fillStyle='#3ddc84';ctx.fillRect(50,runnerY,25,25);
        ctx.fillStyle='#ff5d4d';runnerObstacles.forEach(o=>ctx.fillRect(o.x,o.y,o.w,o.h));
        ctx.fillStyle='#333';ctx.fillRect(0,175,350,25);
    },20);
}
function runnerJump(){if(runnerY>=150)runnerVY=-8;}

// ============ INVADERS ============
let invPX=160, invBullets=[], invEnemies=[], invScore=0;
function startInvaders(){
    invScore=0; invPX=160; invBullets=[]; invEnemies=[];
    for(let r=0;r<3;r++) for(let c=0;c<6;c++) invEnemies.push({x:40+c*45,y:20+r*30,alive:true});
    document.getElementById('invadersScore').textContent='0';
    const canvas=document.getElementById('canvasInvaders'),ctx=canvas.getContext('2d');
    clearInterval(intervals.invaders);
    intervals.invaders=setInterval(()=>{
        invEnemies.forEach(e=>e.x+=(Math.floor(Date.now()/800)%2===0?1:-1));
        invBullets.forEach(b=>b.y-=5); invBullets=invBullets.filter(b=>b.y>0);
        invBullets.forEach(b=>invEnemies.forEach(e=>{if(e.alive&&b.x>e.x&&b.x<e.x+30&&b.y>e.y&&b.y<e.y+20){e.alive=false;b.y=-100;invScore+=10;}}));
        document.getElementById('invadersScore').textContent=invScore;
        ctx.fillStyle='#000';ctx.fillRect(0,0,350,250);
        ctx.fillStyle='#3ddc84';ctx.fillRect(invPX,220,30,15);
        ctx.fillStyle='#fff';invBullets.forEach(b=>ctx.fillRect(b.x,b.y,3,8));
        ctx.fillStyle='#8c3ce0';invEnemies.forEach(e=>{if(e.alive)ctx.fillRect(e.x,e.y,25,15)});
        if(invEnemies.every(e=>!e.alive)){clearInterval(intervals.invaders);addPts(invScore+50);toast('👾 +'+(invScore+50)+' pts');}
    },50);
}
function invadersMove(d){invPX+=d*20;if(invPX<0)invPX=0;if(invPX>320)invPX=320;}
function invadersShoot(){invBullets.push({x:invPX+15,y:220});}

// ============ SNAKE ============
let snake=[],snakeDirVal='right',snakeFood={},snakeScoreVal=0;
function startSnake(){
    snake=[{x:5,y:5},{x:4,y:5},{x:3,y:5}]; snakeDirVal='right'; snakeScoreVal=0;
    spawnSnakeFood();
    document.getElementById('snakeScore').textContent='0';
    const canvas=document.getElementById('canvasSnake'),ctx=canvas.getContext('2d');
    clearInterval(intervals.snake);
    intervals.snake=setInterval(()=>{
        const h={...snake[0]};
        if(snakeDirVal==='up')h.y--; if(snakeDirVal==='down')h.y++; if(snakeDirVal==='left')h.x--; if(snakeDirVal==='right')h.x++;
        if(h.x<0||h.x>=20||h.y<0||h.y>=20||snake.some(s=>s.x===h.x&&s.y===h.y)){clearInterval(intervals.snake);addPts(snakeScoreVal);toast('🐍 +'+snakeScoreVal+' pts');return;}
        snake.unshift(h);
        if(h.x===snakeFood.x&&h.y===snakeFood.y){snakeScoreVal+=10;spawnSnakeFood();}else{snake.pop();}
        document.getElementById('snakeScore').textContent=snakeScoreVal;
        ctx.fillStyle='#000';ctx.fillRect(0,0,300,300);
        ctx.fillStyle='#3ddc84';snake.forEach(s=>ctx.fillRect(s.x*15,s.y*15,14,14));
        ctx.fillStyle='#ff5d4d';ctx.fillRect(snakeFood.x*15,snakeFood.y*15,14,14);
    },100);
}
function spawnSnakeFood(){snakeFood={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};while(snake.some(s=>s.x===snakeFood.x&&s.y===snakeFood.y))spawnSnakeFood();}
function snakeDir(d){snakeDirVal=d;}

// ============ BREAKOUT ============
let brPX=140,brBX=175,brBY=200,brBDX=2,brBDY=-3,brBricks=[],brScore=0;
function startBreakout(){
    brScore=0;brPX=140;brBX=175;brBY=200;brBDX=2;brBDY=-3;brBricks=[];
    for(let r=0;r<4;r++) for(let c=0;c<7;c++) brBricks.push({x:c*48+8,y:r*20+10,alive:true});
    document.getElementById('breakoutScore').textContent='0';
    const canvas=document.getElementById('canvasBreakout'),ctx=canvas.getContext('2d');
    clearInterval(intervals.breakout);
    intervals.breakout=setInterval(()=>{
        brBX+=brBDX;brBY+=brBDY;
        if(brBX<0||brBX>340)brBDX*=-1;if(brBY<0)brBDY*=-1;
        if(brBY>230&&brBX>brPX&&brBX<brPX+60){brBDY*=-1;brBY=229;}
        if(brBY>250){clearInterval(intervals.breakout);addPts(brScore);toast('🧱 +'+brScore+' pts');return;}
        brBricks.forEach(b=>{if(b.alive&&brBX>b.x&&brBX<b.x+44&&brBY>b.y&&brBY<b.y+15){b.alive=false;brBDY*=-1;brScore+=10;}});
        document.getElementById('breakoutScore').textContent=brScore;
        ctx.fillStyle='#000';ctx.fillRect(0,0,350,250);
        ctx.fillStyle='#ffd700';ctx.fillRect(brPX,235,60,10);
        ctx.fillStyle='#fff';ctx.fillRect(brBX,brBY,8,8);
        ctx.fillStyle='#8c3ce0';brBricks.forEach(b=>{if(b.alive)ctx.fillRect(b.x,b.y,44,12)});
        if(brBricks.every(b=>!b.alive)){clearInterval(intervals.breakout);addPts(brScore+100);toast('🧱 +'+(brScore+100)+' pts');}
    },16);
}
function breakoutMove(d){brPX+=d*30;if(brPX<0)brPX=0;if(brPX>290)brPX=290;}

// ============ FLAPPY ============
let flBY=150,flBVY=0,flPipes=[],flScore=0;
function startFlappy(){
    flScore=0;flBY=150;flBVY=0;flPipes=[{x:300,gapY:150}];
    document.getElementById('flappyScore').textContent='0';
    const canvas=document.getElementById('canvasFlappy'),ctx=canvas.getContext('2d');
    clearInterval(intervals.flappy);
    intervals.flappy=setInterval(()=>{
        flBVY+=0.3;flBY+=flBVY;
        flPipes.forEach(p=>p.x-=2);
        if(flPipes[flPipes.length-1].x<200)flPipes.push({x:320,gapY:80+Math.random()*120});
        flPipes=flPipes.filter(p=>p.x>-50);
        flPipes.forEach(p=>{if(p.x===48)flScore++;});
        const bird={x:50,y:flBY,w:20,h:20};
        flPipes.forEach(p=>{if(bird.x<p.x+30&&bird.x+bird.w>p.x&&(bird.y<p.gapY-40||bird.y+bird.h>p.gapY+40)){clearInterval(intervals.flappy);addPts(flScore);toast('🐦 +'+flScore+' pts');}});
        if(flBY<0||flBY>280){clearInterval(intervals.flappy);addPts(flScore);toast('🐦 +'+flScore+' pts');}
        document.getElementById('flappyScore').textContent=flScore;
        ctx.fillStyle='#4a9eff';ctx.fillRect(0,0,300,300);
        ctx.fillStyle='#ffd700';ctx.fillRect(50,flBY,20,20);
        ctx.fillStyle='#3ddc84';flPipes.forEach(p=>{ctx.fillRect(p.x,0,30,p.gapY-40);ctx.fillRect(p.x,p.gapY+40,30,300-p.gapY-40);});
    },16);
}
function flappyFlap(){flBVY=-5;}

// ============ PLATFORMER ============
let plX=50,plY=50,plVY=0,plScore=0,plPlatforms=[{x:0,y:230,w:400,h:20},{x:100,y:180,w:60,h:10},{x:200,y:140,w:60,h:10}];
function startPlatformer(){
    plX=50;plY=50;plVY=0;plScore=0;
    const canvas=document.getElementById('canvasPlatformer'),ctx=canvas.getContext('2d');
    clearInterval(intervals.platformer);
    intervals.platformer=setInterval(()=>{
        plVY+=0.4;plY+=plVY;
        plPlatforms.forEach(p=>{if(plX+20>p.x&&plX<p.x+p.w&&plY+20>p.y&&plY+20<p.y+15&&plVY>0){plY=p.y-20;plVY=0;}});
        if(plY>250){plY=50;plVY=0;plScore++;}
        document.getElementById('platformerScore').textContent=plScore;
        ctx.fillStyle='#000';ctx.fillRect(0,0,350,250);
        ctx.fillStyle='#3ddc84';ctx.fillRect(plX,plY,20,20);
        ctx.fillStyle='#8c3ce0';plPlatforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));
    },16);
}
function platMove(d){plX+=d*5;if(plX<0)plX=0;if(plX>330)plX=330;}
function platJump(){if(plY>=220)plVY=-8;}

// ============ SPORTS (simplifiés) ============
function drawBasket(){const c=document.getElementById('canvasBasket'),ctx=c.getContext('2d');ctx.fillStyle='#4a9eff';ctx.fillRect(0,0,300,300);ctx.fillStyle='#ff8c42';ctx.fillRect(230,150,20,20);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(240,145,30,0,Math.PI*2);ctx.stroke();}
function basketShoot(){const p=parseInt(document.getElementById('basketPower').value);addPts(p*10);toast('🏀 +'+(p*10)+' pts');drawBasket();}
function drawFootball(){const c=document.getElementById('canvasFootball'),ctx=c.getContext('2d');ctx.fillStyle='#3ddc84';ctx.fillRect(0,0,300,250);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.strokeRect(200,100,80,120);}
function footballShoot(z){const k=['gauche','centre','droite'][Math.floor(Math.random()*3)];if(z!==k){addPts(30);toast('⚽ BUT +30');}else{toast('😞 Arrêté');}drawFootball();}
function drawBowling(){const c=document.getElementById('canvasBowling'),ctx=c.getContext('2d');ctx.fillStyle='#333';ctx.fillRect(0,0,300,200);ctx.fillStyle='#fff';for(let i=0;i<10;i++)ctx.fillRect(200+i*8,80,6,12);}
function bowlingThrow(){const p=parseInt(document.getElementById('bowlingPower').value);addPts(p*5);toast('🎳 +'+(p*5)+' pts');}
function drawDarts(){const c=document.getElementById('canvasDarts'),ctx=c.getContext('2d');ctx.fillStyle='#1a1a1a';ctx.fillRect(0,0,300,300);for(let i=4;i>0;i--){ctx.beginPath();ctx.arc(150,150,i*30,0,Math.PI*2);ctx.fillStyle=['#ff5d4d','#3ddc84','#4a9eff','#fff'][i-1];ctx.fill();ctx.stroke();}}
function dartsThrow(){const r=Math.random();if(r<.1){addPts(50);toast('🎯 BULLSEYE +50');}else if(r<.4){addPts(20);toast('🎯 +20');}else{addPts(5);toast('🎯 +5');}}
function startBoxing(){const c=document.getElementById('canvasBoxing'),ctx=c.getContext('2d');ctx.fillStyle='#333';ctx.fillRect(0,0,300,200);ctx.fillStyle='#4a9eff';ctx.fillRect(50,120,40,60);ctx.fillStyle='#ff5d4d';ctx.fillRect(210,120,40,60);}
function boxingPunch(){addPts(10);toast('👊 +10');}
function boxingDodge(){addPts(5);toast('↩️ +5');}
function drawGolf(){const c=document.getElementById('canvasGolf'),ctx=c.getContext('2d');ctx.fillStyle='#3ddc84';ctx.fillRect(0,0,300,200);ctx.fillStyle='#fff';ctx.fillRect(20,170,10,10);ctx.fillStyle='#000';ctx.beginPath();ctx.arc(270,30,12,0,Math.PI*2);ctx.fill();}
function golfSwing(){const p=parseInt(document.getElementById('golfPower').value);addPts(p*8);toast('⛳ +'+(p*8)+' pts');}

// ============ 2048 ============
let grid2048=[];
function start2048(){grid2048=Array(16).fill(0);for(let i=0;i<2;i++){const e=Math.floor(Math.random()*16);if(grid2048[e]===0)grid2048[e]=2;}document.getElementById('score2048').textContent='0';render2048();}
function render2048(){let h='';grid2048.forEach(v=>{const colors=['','#eee4da','#ede0c8','#f2b179','#f59563','#f67c5f','#f65e3b','#edcf72','#edcc61','#3ddc84'];h+='<div style="aspect-ratio:1;background:'+(v?colors[Math.log2(v)]||'#3ddc84':'#1a1a2a')+';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;border-radius:6px">'+(v||'')+'</div>';});document.getElementById('grid2048').innerHTML=h;}
function move2048(d){addPts(5);start2048();}

// ============ MEMORY ============
function startMemory(){const e=['🍎','🍊','🍋','🍇','🍒','🥝','🍑','🍌'];let h='';[...e,...e].sort(()=>Math.random()-.5).forEach(em=>{h+='<div style="aspect-ratio:1;background:#1a1a3a;display:flex;align-items:center;justify-content:center;font-size:25px;border-radius:6px;cursor:pointer">?</div>';});document.getElementById('memoryGrid').innerHTML=h;}

// ============ WORDLE ============
const wordleWord='PIECE';
function startWordle(){document.getElementById('wordleMsg').textContent='5 lettres';}
function wordleGuess(){const w=document.getElementById('wordleInput').value.toUpperCase();if(w===wordleWord){addPts(100);toast('💡 Bravo +100');}else{toast('❌ Essaye encore');}}

// ============ MINES ============
let minesData=[],minesGain=0,minesActive=false;
function startMines(){minesData=Array(25).fill(null).map(()=>({bomb:false,revealed:false}));let b=0;while(b<3){const p=Math.floor(Math.random()*25);if(!minesData[p].bomb){minesData[p].bomb=true;b++;}}minesGain=0;minesActive=true;document.getElementById('minesGain').textContent='0';renderMines();}
function renderMines(){let h='';minesData.forEach((c,i)=>{h+='<div onclick="revealMine('+i+')" style="aspect-ratio:1;background:'+(c.revealed?(c.bomb?'#3a1a1a':'#1a3a1a'):'#1a1a3a')+';display:flex;align-items:center;justify-content:center;font-size:20px;border-radius:6px;cursor:pointer">'+(c.revealed?(c.bomb?'💣':'💎'):'?')+'</div>';});document.getElementById('minesGrid').innerHTML=h;}
function revealMine(i){if(!minesActive||minesData[i].revealed)return;minesData[i].revealed=true;if(minesData[i].bomb){minesActive=false;toast('💣 Perdu !');}else{minesGain+=25;document.getElementById('minesGain').textContent=minesGain;}renderMines();}
function cashOut(){if(minesActive&&minesGain>0){addPts(minesGain);toast('💰 +'+minesGain+' pts');minesActive=false;closeGame('mines');}}

// ============ COLOR MATCH ============
function startColorMatch(){const colors=['#ff5d4d','#3ddc84','#4a9eff','#ffd700','#8c3ce0','#ff8c42'];const target=colors[Math.floor(Math.random()*6)];document.getElementById('colorTarget').style.background=target;let h='';colors.sort(()=>Math.random()-.5).forEach(c=>{h+='<div onclick="checkColor(\''+c+'\',\''+target+'\')" style="aspect-ratio:1;background:'+c+';border-radius:8px;cursor:pointer"></div>';});document.getElementById('colorOptions').innerHTML=h;}
function checkColor(c,t){if(c===t){addPts(20);toast('✅ +20');}else{toast('❌ Perdu');}startColorMatch();}

// ============ PUZZLE ============
function startPuzzle(){const n=[1,2,3,4,5,6,7,8,''].sort(()=>Math.random()-.5);let h='';n.forEach(v=>{h+='<div style="aspect-ratio:1;background:'+(v?'#8c3ce0':'#333')+';display:flex;align-items:center;justify-content:center;font-size:20px;border-radius:6px">'+v+'</div>';});document.getElementById('puzzleGrid').innerHTML=h;}

// ============ SLOTS ============
function spinSlots(){const sym=['🍒','🍋','🍊','🍇','💎','7️⃣','⭐'];const s1=sym[Math.floor(Math.random()*7)],s2=sym[Math.floor(Math.random()*7)],s3=sym[Math.floor(Math.random()*7)];document.getElementById('s1').textContent=s1;document.getElementById('s2').textContent=s2;document.getElementById('s3').textContent=s3;if(s1===s2&&s2===s3){addPts(100);toast('🎰 JACKPOT +100');}else if(s1===s2||s2===s3||s1===s3){addPts(10);toast('🎉 +10');}}

// ============ DICE ============
function rollDice(){const r=Math.floor(Math.random()*6)+1;document.getElementById('diceDisplay').textContent=['','⚀','⚁','⚂','⚃','⚄','⚅'][r];document.getElementById('diceResult').textContent=r;addPts(r*5);}

// ============ COIN FLIP ============
function flipCoin(c){const r=Math.random()<.5?'pile':'face';document.getElementById('coinDisplay').textContent=r==='pile'?'🟡':'⚪';if(c===r){addPts(50);toast('✅ +50');}else{toast('❌ Perdu');}}

// ============ WHEEL ============
function drawWheel(){const canvas=document.getElementById('canvasWheel'),ctx=canvas.getContext('2d');const p=[5,10,25,50,100],colors=['#1d3322','#234027','#b88f2f','#e8b84b','#ff5d4d'];for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(125,125);ctx.arc(125,125,100,(i*72-90)*Math.PI/180,((i+1)*72-90)*Math.PI/180);ctx.fillStyle=colors[i];ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='14px Arial';ctx.fillText(p[i],125+60*Math.cos((i*72+36-90)*Math.PI/180),125+60*Math.sin((i*72+36-90)*Math.PI/180));}}
function spinWheel(){const prize=[5,10,25,50,100][Math.floor(Math.random()*5)];addPts(prize);document.getElementById('wheelGain').textContent=prize+' pts';toast('🎡 +'+prize+' pts');}

// ============ WHACK ============
function initWhack(){let h='';for(let i=0;i<9;i++)h+='<div id="whackHole'+i+'" style="aspect-ratio:1;background:#1a1a3a;border-radius:50%;font-size:30px;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="whackHit('+i+')"></div>';document.getElementById('whackGrid').innerHTML