const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
let currentX, currentY;
let tetrominos;
let currentTetromino;
let tetrominos_A;
let tetrominos_B;
let timer;
let tetris_set = 0;
let btetrominos;
let Shifttetrominos;
let Shift_usenum = 0;
class Board {
    constructor() {
        this.color = "WHITE";
        this.filled = false;
    }

    getColor() {
        return this.color;
    }

    isFilled() {
        return this.filled;
    }

    setColor(color) {
        this.color = color;
    }

    setFilled(filled) {
        this.filled = filled;
    }
}
const board = [];
for (let i = 0; i < BOARD_WIDTH; i++) {
    const row = [];
    for (let j = 0; j < BOARD_HEIGHT; j++) {
        const cell = new Board();
        row.push(cell);
    }
    board.push(row);
}
function initializeGame() {
    currentX = Math.floor(BOARD_WIDTH / 2) - 1;
    currentY = 0;
    tetrominos = [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[1, 1], [1, 1]],
        [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
        [[0, 0, 0], [0, 1, 1], [1, 1, 0]]];
    tetrominos_A = shuffle_tetrominos(tetrominos);
    tetrominos_B = shuffle_tetrominos(tetrominos);
    btetrominos = tetrominos_A[0];

    timer = setInterval(update, 500);
}
function setColor(tetromino) {
    if (camp_tetromino(tetromino, tetrominos[0])) {
        // I 테트로미노
        return 'rgb(135, 206, 235)';
    }
    else if (camp_tetromino(tetromino, tetrominos[1])) {
        // L 테트로미노
        return 'orange';
    }
    else if (camp_tetromino(tetromino, tetrominos[2])) {
        // J 테트로미노
        return 'blue';
    }
    else if (camp_tetromino(tetromino, tetrominos[3])) {
        // O 테트로미노
        return 'magenta';
    }
    else if (camp_tetromino(tetromino, tetrominos[4])) {
        // T 테트로미노
        return 'yellow';
    }
    else if (camp_tetromino(tetromino, tetrominos[5])) {
        // S 테트로미노
        return 'red';
    }
    else {
        // 나머지 테트로미노
        return 'green';
    }
}

function camp_tetromino(t_A, t_B) {
    if (t_A.length != t_B.length) {
        return false;
    }
    for (let i = 0; i < t_A.length; i++) {
        for (let j = 0; j < t_A.length; j++) {
            if (t_A[i][j] !== t_B[i][j]) {
                return false;
            }
        }
    }
    return true;
}
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
function shuffle_tetrominos(tetrominos) {
    const idx = [0, 1, 2, 3, 4, 5, 6];
    shuffle(idx);
    const shuffled_tetro = [];
    for (let i = 0; i < 7; i++) {
        shuffled_tetro[i] = tetrominos[idx[i]];
    }
    return shuffled_tetro;
}
function setTetrominos(t_A, t_B) {
    for (let i = 0; i < 6; i++) {
        t_A[i] = t_A[i + 1];
    }
    if (tetris_set > 6) {
        tetrominos_B = shuffle_tetrominos(tetrominos);
        tetris_set = 0;
    }
    t_A[6] = t_B[tetris_set];
    tetris_set++;
    Shift_usenum = 0;
    btetrominos = t_A[0];
}
function transpose_Left(tetrominos) {
    let length = tetrominos.length;

    let transposeTetrominos = new Array(length);

    for (var i = 0; i < transposeTetrominos.length; i++) {
        transposeTetrominos[i] = new Array(length).fill(0);
    }
    for (let i = length - 1; i >= 0; i--) {
        for (let j = 0; j < length; j++) {
            transposeTetrominos[j][length - 1 - i] = tetrominos[i][j];
        }
    }
    if (isCollision(transposeTetrominos, currentX, currentY)) {
        if (currentX + length >= BOARD_WIDTH) {
            currentX = BOARD_WIDTH - length;
        }
        else if (currentY + length >= BOARD_HEIGHT) {
            currentY = BOARD_HEIGHT - length;
        }
        else {
            currentX = 0;
        }
    }
    return transposeTetrominos;
}
function transpose_Right(tetrominos) {
    let length = tetrominos.length;
    let transposeTetrominos = new Array(length);

    for (var i = 0; i < transposeTetrominos.length; i++) {
        transposeTetrominos[i] = new Array(length).fill(0);
    }
    for (let i = 0; i < length; i++) {
        for (let j = length - 1; j >= 0; j--) {
            transposeTetrominos[length - 1 - j][i] = tetrominos[i][j];
        }
    }
    if (isCollision(transposeTetrominos, currentX, currentY)) {
        if (currentX + length >= BOARD_WIDTH) {
            currentX = BOARD_WIDTH - length;
        }
        else if (currentY + length >= BOARD_HEIGHT) {
            currentY = BOARD_HEIGHT - length;
        }
        else {
            currentX = 0;
        }
    }
    return transposeTetrominos;
}
function Shift_tetrominos(tetrominos) {
    if (Shifttetrominos == null) {
        Shifttetrominos = btetrominos;
        setTetrominos(tetrominos_A, tetrominos_B);
        Shift_usenum = 1;
        currentX = BOARD_WIDTH / 2 - 1;
        currentY = 0;
        btetrominos = tetrominos_A[0];
        return tetrominos_A[0];
    }
    else if (Shift_usenum == 0) {
        let swamp = Shifttetrominos;
        Shifttetrominos = btetrominos;
        Shift_usenum = 1;
        currentX = BOARD_WIDTH / 2 - 1;
        currentY = 0;
        btetrominos = swamp;
        return swamp;
    }
    else {
        return tetrominos;
    }
}
function drawBlock(x, y, color, BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}
// 수직 라인 그리기
function draw_board() {
    for (let x = 0; x <= BOARD_WIDTH * BLOCK_SIZE; x += BLOCK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, BOARD_HEIGHT * BLOCK_SIZE);
        ctx.stroke();
    }

    // 수평 라인 그리기
    for (let y = 0; y <= BOARD_HEIGHT * BLOCK_SIZE; y += BLOCK_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y);
        ctx.stroke();
    }
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            if (board[x][y].isFilled) {
                drawBlock(x, y, board[x][y].getColor(), BLOCK_SIZE);
            }
        }
    }
}
function isCollision(Tetromino, x, y) {
    let newX = 0;
    let newY = 0;
    for (let i = 0; i < Tetromino.length; i++) {
        for (let j = 0; j < Tetromino[i].length; j++) {
            if (Tetromino[i][j] == 1) {
                newX = j + x;
                newY = i + y;
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return true;
                }
                else if (board[newX][newY].isFilled()) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkLines() {
    for (let y = currentY; y < BOARD_HEIGHT; y++) {
        let lineComplete = true;
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (!board[x][y].isFilled()) {
                lineComplete = false;
                break;
            }
        }
        if (lineComplete) {
            moveLinesDown(y);
        }
    }
}

function moveLinesDown(line) {
    for (let y = line; y > 0; y--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            board[x][y].setColor(board[x][y - 1].getColor());
            board[x][y].setFilled(board[x][y - 1].isFilled());
        }
    }
    for (let x = 0; x < BOARD_WIDTH; x++) {
        board[x][0].setFilled(false);
    }
}

function placeTetromino(Tetrominos) {
    for (let i = 0; i < Tetrominos.length; i++) {
        for (let j = 0; j < Tetrominos[i].length; j++) {
            if (Tetrominos[i][j]) {
                board[j + currentX][i + currentY].setColor(setColor(btetrominos));
                board[j + currentX][i + currentY].setFilled(true);
            }
        }
    }
}

function drawTetromino(Tetrominos) {
    for (let i = 0; i < Tetrominos.length; i++) {
        for (let j = 0; j < Tetrominos[i].length; j++) {
            if (Tetrominos[i][j]) {
                drawBlock(currentX + j, currentY + i, setColor(btetrominos), BLOCK_SIZE);
            }
        }
    }
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
        currentY++;
    }
    else {
        placeTetromino(tetrominos_A[0]);
        checkLines();
        setTetrominos(tetrominos_A, tetrominos_B);
        currentX = Math.floor(BOARD_WIDTH / 2) - 1;
        currentY = 0;
        if (isCollision(tetrominos_A[0], currentX, currentY)) {
            // Game over
            clearInterval(timer);
            alert('Game Over!');
            window.close();
        }
    }
    paint();
}
function paint() {
    clearCanvas();
    draw_board();
    drawTetromino(tetrominos_A[0]);
    drawother();
}
initializeGame();
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            if (!isCollision(tetrominos_A[0], currentX - 1, currentY)) {
                currentX--;
            }
            break;
        case 39: // Right arrow key
            if (!isCollision(tetrominos_A[0], currentX + 1, currentY)) {
                currentX++;
            }
            break;
        case 40: // Down arrow key
            if (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
                currentY++;
            }
            break;
        case 32: // Space key
            while (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
                currentY++;
            }
            break;
        case 90: // Z key
            if (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
                tetrominos_A[0] = transpose_Left(tetrominos_A[0]);
            }
            break;
        case 88: // X key
            if (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
                tetrominos_A[0] = transpose_Right(tetrominos_A[0]);
            }
            break;
        case 16: // Shift key
            if (!isCollision(tetrominos_A[0], currentX, currentY + 1)) {
                if (Shift_usenum == 0) {
                    tetrominos_A[0] = Shift_tetrominos(btetrominos);
                }
            }
            break;
    }
    paint();
});
function drawother() {
    let line = [0, 120, 600];
    ctx.beginPath();
    ctx.moveTo(420, 0);
    ctx.lineTo(420, 600);
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(300, line[i]);
        ctx.lineTo(420, line[i]);
        ctx.stroke();
    }

    if (Shifttetrominos != null) {
        for (let i = 0; i < Shifttetrominos.length; i++) {
            for (let j = 0; j < Shifttetrominos[i].length; j++) {
                if (Shifttetrominos[i][j] == 1) {
                    drawBlock(16 + j, 1 + i, setColor(Shifttetrominos), 20);
                }
            }
        }
    }
    let yOffset = 5;
    for (let i = 1; i < 6; i++) {
        for (let j = 0; j < tetrominos_A[i].length; j++) {
            for (let k = 0; k < tetrominos_A[i][j].length; k++) {
                if (tetrominos_A[i][j][k] == 1) {
                    drawBlock(13 + k, yOffset + j, setColor(tetrominos_A[i]), 24);
                }
            }
        }
        yOffset += 4;
    }
}