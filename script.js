const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector(".high-score");
let highScore = parseInt(localStorage.getItem("highScore"));
const reset = document.querySelector(".hsr");

canvas.height = 500;
canvas.width = 500;

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

if(isNaN(highScore)){
    highScore = 0;
}

scoreDisplay.innerHTML = `High Score : ${highScore}`;

reset.addEventListener('click', () =>{
    localStorage.setItem("highScore", "0");
    score = 0;
    scoreDisplay.innerHTML = "High Score: 0";
    drawBricks();
});

function keyDown(e){
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = true;
    }else if(e.key == 'Left' || e.key == 'ArrowLeft'){
        leftPressed = true;
    }
}

function keyUp(e){
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = false;
    }else if(e.key == 'Left' || e.key == 'ArrowLeft'){
        leftPressed = false;
    }
}

let score = 0;

function drawScore() {
    ctx.font = '18px Games, sans-serif';
    // ctx.fillStyle = "#ABABE2";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score : " + score, 8, 20);
}

function movePaddle(){
    if(rightPressed){
        paddle.x += 7;
        if(paddle.x + paddle.width >= canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    }else if(leftPressed){
        paddle.x -= 7;
        if(paddle.x < 0){
            paddle.x = 0;
        }

    }
    
}

let speed = 4;


let ball = {
    x: canvas.width/2,
    y: canvas.height - 50,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function(){
        ctx.beginPath();
    // ctx.fillStyle = "#ABABE2";
        ctx.fillStyle = "#fff";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
};


let paddle = {
    height: 10,
    width: 70,
    x: canvas.width/2 -70/2,
    draw: function() {
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    // ctx.fillStyle = "#ABABE2";
    ctx.fillStyle = "#fff";
        ctx.closePath();
        ctx.fill();

    }
};

function play(){

    ctx.clearRect(0, 0, canvas.width, canvas.height)        //clear the ball path
    ball.draw();
    paddle.draw();
    drawBricks();
    movePaddle();
    collision();
    levelUp();
    drawScore();
    
    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.radius > canvas.height || ball.x - ball.radius < 0){
        ball.dx *= -1;
    }

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.dy *= -1;
    }

    //reset score
    if(ball.y + ball.radius > canvas.height){
        if(score > parseInt(localStorage.getItem("highScore"))){
            localStorage.setItem("highScore", score.toString());
            scoreDisplay.innerHTML = `High Score: ${score}`;
        }

        score = 0;
        generateBricks();
        ball.dx = speed;
        ball.dy = -speed + 1;
    }



    //bounce the ball
    if(
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height
    ){
        ball.dy *= -1;
    }



    requestAnimationFrame(play);  
}


let brickRow = 3;
let brickCol = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;

let bricks = [];

function generateBricks(){
    for(let c = 0; c < brickCol; c++){
        bricks[c] = [];
        for(let r = 0; r < brickRow; r++){
            bricks[c][r] = {x: 0, y: 0, status: 1};
        }
    }
}

function drawBricks(){
    for(let c = 0; c < brickCol; c++){
        for(let r = 0; r < brickRow; r++){
            if(bricks[c] [r].status === 1){
                let bricksX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let bricksY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = bricksX;
                bricks[c][r].y = bricksY;
                ctx.beginPath();
                ctx.rect(bricksX, bricksY, brickWidth, brickHeight);
                // ctx.fillStyle = "#ABABE2";
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.closePath();

            }
        }
    }
}

function collision(){
    for(let c = 0; c < brickCol; c++){
        for(let r = 0; r < brickRow; r++){
            let b = bricks[c][r];
            if(b.status == 1) {
                if(
                    ball.x >= b.x &&
                    ball.x <= b.x + brickWidth &&
                    ball.y >= b.y &&
                    ball.y <= b.y + brickHeight 
                ){
                ball.dy *= -1;
                b.status = 0;
                score++;
            }
        }

    }

}
}

let gameLevelup = true; 
function levelUp(){
     if(score%15 == 0 && score != 0){
         if(ball.y > canvas.height/2 ){
             generateBricks();
         }

         if(gameLevelup){
             if(ball.dy > 0){
                 ball.dy += 1;
                 gameLevelup = false;
             }else if(ball.dy < 0){
                 ball.dy -= 1;
                 gameLevelup = false;
             }
         }

         if(score%15 != 0){
             gameLevelup = true;
         }
     }
}
generateBricks();
play();


