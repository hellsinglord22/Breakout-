/**
take hold of the gameCanvas and create the tool that willbe used to draw
on the canves
 */
var gameCanvas = document.getElementById("gameCanvas");
var brush = gameCanvas.getContext("2d");

// Bricks information
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// Storing Bricks inside a 2D array
var bricks = [];
for(var column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for(var row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1};
    }
}

// player score
var score = 0;

// initial position
var x = gameCanvas.width / 2;
var y = gameCanvas.height - 30;

// the speed of the ball
var xVelocity = 2;
var yVelocity = -2;

// the radious of the ball
var radius = 10;
var secuirty = 5;
var colors = ["red", "green", "#0095DD"];
var colorIterator = 0;

// ball default color
var defaultColor = "#0095DD";

// give the ball a default color
brush.fillStyle = defaultColor;

// paddle dimnations
var paddleWidth = 70;
var paddleHeight = 10;

// paddle itial position
var paddleXPosition = (gameCanvas.width - paddleWidth) / 2;

// control information
var rightPressed = false;
var leftPressed = false;

// how many lives you have before you get a game over
var lives = 3;


// add event listener ( Game Control )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// handling if ( <- or -> ) are hit
function keyDownHandler(e){
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.keyCode == 39) {
        console.log(e.keyCode);
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}


// drawing the ball
var drawBall = function()
{
    brush.beginPath();
    brush.arc(x, y, radius, 0, Math.PI * 2);
    brush.fill();
    brush.closePath();
};

var bounceBall = function()
{
    if( (x - (radius / 2) - secuirty <= 0) || (x + (radius / 2) + secuirty >= gameCanvas.width))
    {
        xVelocity *= -1;
        brush.fillStyle = colors[(++colorIterator) % 3];
    }
    else if (y - (radius / 2) - secuirty <= 0 )
    {
        yVelocity *= -1;
        brush.fillStyle = colors[(++colorIterator) % 3];
    }
    else if (y + (radius / 2) + secuirty >= gameCanvas.height)
    {
        if(x > paddleXPosition - 7 && x < paddleXPosition + paddleWidth + 7)
        {
            yVelocity *= 1.1;
            xVelocity *= 1.1;
            yVelocity *= -1;
        }
        else
        {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = gameCanvas.width/2;
                y = gameCanvas.height-30;
                xVelocity = 2;
                yVelocity = -2;
                paddleXPosition = (gameCanvas.width-paddleWidth)/2;
            }
        }

    }
};

// draw paddle
var drawPaddle = function(){
    brush.beginPath();
    brush.rect(paddleXPosition, gameCanvas.height - 10, paddleWidth, paddleHeight);
    brush.fillStyle = "#0095DD";
    brush.fill();
    brush.closePath();
};

var movePaddle = function(){
    if(rightPressed && paddleXPosition < gameCanvas.width-paddleWidth) {
        paddleXPosition += 7;
    }
    else if(leftPressed && paddleXPosition > 0) {
        paddleXPosition -= 7;
    }
};

// making a log
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
             if (bricks[c][r].status == 1)
             {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                brush.beginPath();
                brush.rect(brickX, brickY, brickWidth, brickHeight);
                brush.fillStyle = "#0095DD";
                brush.fill();
                brush.closePath();
             }

        }
    }
}


function collisionDetection(){
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    yVelocity *= -1;
                    b.status = 0;
                    score++;

                    if (score == brickColumnCount * brickRowCount){
                        alert("You have won !!!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


var drawScore = function(){
    brush.font = "16px Arial";
    brush.fillStyle = "#0095DD";
    brush.fillText("Score: "+score, 8, 20);
};



function draw()
{
    brush.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    bounceBall();
    collisionDetection();
    movePaddle();
    x += xVelocity;
    y += yVelocity;
}

// start the game and bounce the ball
setInterval(draw, 10);
