const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const playerSelection = document.getElementById('playerSelection');
const chooseXButton = document.getElementById('chooseX');
const chooseOButton = document.getElementById('chooseO');

let boardSize = 3;
let playerSymbol = 'X';
let botSymbol = 'O';
let currentPlayer = 'X';
let board = [];
let gameActive = false;

function initializeBoard(size) {
    board = Array(size).fill(null).map(() => Array(size).fill(null));
    renderBoard();
    updateStatus();
    gameActive = true;  // Ensure the game is active after initializing the board
}

function renderBoard() {
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = i;
            square.dataset.col = j;
            square.addEventListener('click', handleSquareClick);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (board[row][col] !== null || !gameActive || currentPlayer !== playerSymbol) {
        return; // Invalid move
    }

    board[row][col] = playerSymbol;
    event.target.textContent = playerSymbol;

    if (checkWin(playerSymbol)) {
        alert(`You win!`);
        if (boardSize < 10) {
            boardSize++;
        }
        initializeBoard(boardSize);  // Initialize the new board for the next round
    } else if (checkDraw()) {
        alert("It's a draw!");
        resetToStartScreen();  // Reset to start screen after a draw
    } else {
        currentPlayer = botSymbol;
        botMove();
    }
}

function botMove() {
    if (!gameActive) return;

    let availableMoves = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === null) {
                availableMoves.push({ row: i, col: j });
            }
        }
    }

    if (availableMoves.length === 0) return;

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[randomMove.row][randomMove.col] = botSymbol;

    const square = document.querySelector(`[data-row="${randomMove.row}"][data-col="${randomMove.col}"]`);
    square.textContent = botSymbol;

    if (checkWin(botSymbol)) {
        alert(`Bot wins!`);
        resetToStartScreen();  // Reset to start screen after a loss
    } else if (checkDraw()) {
        alert("It's a draw!");
        resetToStartScreen();  // Reset to start screen after a draw
    } else {
        currentPlayer = playerSymbol;
    }
}

function checkWin(symbol) {
    // Check rows, columns, and diagonals
    const winPatterns = [
        ...board, // Rows
        ...board[0].map((_, colIndex) => board.map(row => row[colIndex])), // Columns
        board.map((row, index) => board[index][index]), // Main diagonal
        board.map((row, index) => board[index][boardSize - 1 - index]) // Anti-diagonal
    ];

    return winPatterns.some(pattern => pattern.every(cell => cell === symbol));
}

function checkDraw() {
    return board.flat().every(cell => cell !== null);
}

function updateStatus() {
    statusElement.textContent = `Current Board Size: ${boardSize}x${boardSize}`;
}

function startGame(selectedSymbol) {
    playerSymbol = selectedSymbol;
    botSymbol = playerSymbol === 'X' ? 'O' : 'X';
    currentPlayer = 'X';
    gameActive = true;  // Set the game as active when the game starts
    playerSelection.style.display = 'none';
    boardElement.style.visibility = 'visible';
    resetButton.style.visibility = 'visible';
    initializeBoard(boardSize);

    if (playerSymbol === 'O') {
        botMove();  // Bot plays first if the player chooses 'O'
    }
}

function resetToStartScreen() {
    boardSize = 3;  // Reset the board size to 3x3
    gameActive = false;  // Deactivate the game
    playerSelection.style.display = 'block';  // Show the player selection screen
    boardElement.style.visibility = 'hidden';  // Hide the game board
    resetButton.style.visibility = 'hidden';  // Hide the reset button
    statusElement.textContent = '';  // Clear the status text
}

chooseXButton.addEventListener('click', () => startGame('X'));
chooseOButton.addEventListener('click', () => startGame('O'));

resetButton.addEventListener('click', () => {
    resetToStartScreen();  // Reset the game to the start screen
});

initializeBoard(boardSize);
