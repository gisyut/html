const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const paddle_location = 100;
let paddle_height = 165;
const ai_location = 700;
let ai_height = 165;

let ball_vactor = true;
let ball_vactor_x;
let ball_vactor_y;

let ball_x = 190;
let ball_y = 190;

let player_score = 0;
let ai_score = 0;
let timer;
function initializeGame() {
    const randomX = Math.floor(Math.random() * 10) + 1;
    const randomY = Math.floor(Math.random() * 10) + 1;
    ball_vactor_x = randomX;
    ball_vactor_y = randomY;

    timer = setInterval(update, 20);
}
function istouch() {
    if ((ball_x > paddle_location + 10 && ball_x <= paddle_location + 20) && ((ball_y < paddle_height + 70) && (ball_y + 20 > paddle_height))) {
        ball_vactor = true;
        return true;
    }
    else if ((ball_x + 20 < ai_location + 10 && ball_x + 20 >= ai_location) && ((ball_y < ai_height + 70) && (ball_y + 20 > ai_height))) {
        ball_vactor = false;
        return true;
    }
    else {
        return false;
    }
}
function sleep(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}


async function score() {
    if (ball_x <= 0) {
        ai_score++;
        ball_vactor = true;
        set_ball_vac();
        ball_x = 190;
        ball_y = 190;
        paint();
        sleep(3);
    }
    else if (ball_x >= canvas.width) {
        player_score++;
        ball_vactor = false;
        set_ball_vac();
        ball_x = 590;
        ball_y = 190;
        paint();
        sleep(3);
    }
}
function set_ball_vac() {
    let randomX = Math.floor(Math.random() * 10) + 1;
    let randomY = Math.floor(Math.random() * 10) + 1;
    if (!ball_vactor) {
        randomX *= -1;
    }
    ball_vactor_x = randomX;
    ball_vactor_y = randomY;

}
function draw_paddle(x, y) {
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, 5, 70);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, 5, 70);
}
function draw_ball(x, y) {
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 20, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, 20, 20);
}
function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Player: ${player_score}  AI: ${ai_score}`, 10, 30);
}

function update() {
    Ai_move();
    score();
    if (ball_y <= 0 || ball_y >= 380) {
        ball_vactor_y *= -1;
    }
    if (!istouch()) {
        ball_x += ball_vactor_x;
        ball_y += ball_vactor_y;
    }
    else {
        set_ball_vac();
        ball_x += ball_vactor_x;
        ball_y += ball_vactor_y;
    }
    if (player_score == 3) {
        clearInterval(timer);
        alert('Player win');
        window.close();
    }
    else if (ai_score == 3) {
        clearInterval(timer);
        alert('A.I win');
        window.close();
    }
    paint();
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function paint() {
    clearCanvas();
    draw_paddle(paddle_location, paddle_height);
    draw_paddle(ai_location, ai_height);
    draw_ball(ball_x, ball_y);
    drawScore();
}
function Ai_move() {
    if (ball_x > 200) {
        if ((ball_y + 10 > ai_height + 45) && ai_height + 70 < canvas.height) {
            ai_height += 5;
        }
        else if ((ball_y + 10 < ai_height + 45) && ai_height > 0) {
            ai_height -= 5;
        }
    }
}
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 38: // up arrow key
            if (paddle_height > 0) {
                paddle_height -= 20;
            }
            break;
        case 40: // down arrow key
            if (paddle_height + 70 < canvas.height) {
                paddle_height += 20;
            }
            break;
    }
    paint();
});

initializeGame();