function createGameboard() {
    const EMPTY = '';
    const ROWS = 3;
    const COLUMNS = 3;

    const board = [];
    
    for (let i = 0; i < ROWS; ++i) {
        board[i] = [];
    
        for (let j = 0; j < COLUMNS; ++j) {
            board[i].push(EMPTY);
        }
    }

    const getBoard = () => board;

    function markSpace(row, column, mark) {
        if (!inBounds(row, column))
            throw new Error(`Row ${row} and column ${column} are out of bounds.`);
        else if (!spaceEmpty(row, column))
            throw new Error(`The square at row ${row} and column ${column} has already been marked.`);
        else  
            placeMark(row, column, mark);
    }

    function clearBoard() {
        for (let i = 0; i < ROWS; ++i)
            for (let j = 0; j < COLUMNS; ++i)
                board[i][j] = EMPTY;
    }

    const inBounds = (row, column) => rowInBounds(row) && columnInBounds(column);
    const rowInBounds = row => row >= 0 && row <= ROWS - 1;
    const columnInBounds = column => column >= 0 && column <= COLUMNS - 1;
    const spaceEmpty = (row, column) => board[row][column] === EMPTY;
    const placeMark = (row, column, mark) => board[row][column] = mark;

    return { getBoard, markSpace, clearBoard };
}

function createGameController() {
    const PLAYER_ONE_MARK = 'X';
    const PLAYER_TWO_MARK = 'O';

    const PLAYER_ONE = createPlayer("Player 1", PLAYER_ONE_MARK);
    const PLAYER_TWO = createPlayer("Player 2", PLAYER_TWO_MARK);

    const board = createGameboard();

    let currentPlayer = PLAYER_ONE;

    const getBoard = () => board.getBoard();
    const getCurrentPlayer = () => currentPlayer;
    const winner = () => win();
    const tied = () => tie();

    function createPlayer(name, mark) {
        return { name, mark };
    }

    function nextPlayerTurn() {
        currentPlayer = (currentPlayer === PLAYER_ONE) ? PLAYER_TWO : PLAYER_ONE;
    }

    function playTurn(row, column) { 
        try {
            board.markSpace(row, column, currentPlayer.mark);
            if (!win() && !tie()) nextPlayerTurn();          
        }
        catch(error) {
            console.error(error.message);
        }
    }

    function tie() {
        return !win() && boardFilled();
    }

    function boardFilled() {
        for (let row of board.getBoard())
            if (!rowFilled(row))
                return false;

        return true;
    }

    const rowFilled = row => row.every(space => space === PLAYER_ONE_MARK || space === PLAYER_TWO_MARK);

    function win() {
        return horizontal() || vertical() || diagonal();
    }

    function horizontal() {
        for (let row of board.getBoard())
            if (threeInARow(row, currentPlayer.mark))
                return true;
        
        return false;
    }

    const threeInARow = (row, mark) => row.every(space => space === mark);

    function vertical() {
        const gameboard = board.getBoard();

        for (let i = 0; i < gameboard.length; ++i)
            if (threeInAColumn(getColumn(gameboard, i), currentPlayer.mark))
                return true;
        
        return false;
    }

    function getColumn(gameboard, columnIndex) {
        const column = [];
        
        for (let i = 0; i < gameboard.length; ++i)
            column.push(gameboard[i][columnIndex]);

        return column;
    }

    const threeInAColumn = (column, mark) => column.every(space => space === mark);

    function diagonal() {
        const gameboard = board.getBoard();

        const diagonal = getDiagonal(gameboard);
        const antiDiagonal = getAntiDiagonal(gameboard);

        return threeInADiagonal(diagonal, currentPlayer.mark) ||
            threeInADiagonal(antiDiagonal, currentPlayer.mark);
    }

    function getDiagonal(gameboard) {
        const diagonal = [];

        for (let i = 0; i < gameboard.length; ++i)
            diagonal.push(gameboard[i][i]);

        return diagonal;
    }

    function getAntiDiagonal(gameboard) {
        const N = gameboard.length - 1;
        const antiDiagonal = [];

        for (let i = N; i >= 0; --i)
            antiDiagonal.push(gameboard[i][N-i]);

        return antiDiagonal;
    }

    const threeInADiagonal = (diagonal, mark) => diagonal.every(space => space === mark);

    return { playTurn, winner, tied, getBoard, getCurrentPlayer };
}

function createDisplayController() {
    const game = createGameController();

    const turnDisplay = document.querySelector(".turn");
    const boardDisplay = document.querySelector(".board");
    const menuDialog = document.getElementById("menu");
    const menuForm = document.querySelector("form");
    const crossesDialog = document.getElementById("player1-win");
    const noughtsDialog = document.getElementById("player2-win");
    const tieDialog = document.getElementById("tie");

    function updateScreen() {
        updateTurn();
        updateBoard();
    }

    const clearScreen = () => boardDisplay.replaceChildren();
    const updateTurn = () => turnDisplay.textContent = `${game.getCurrentPlayer().name}'s turn`;

    function updateBoard() {
        const board = game.getBoard();

        for (let i = 0; i < board.length; ++i) {
            for (let j = 0; j < board.length; ++j) {
                boardDisplay.appendChild(createCell(i, j, board[i][j]));
            }
        }
    }

    function createCell(row, column, mark) {
        const cell = document.createElement("button");
        cell.classList.add("cell");

        cell.dataset.row = row;
        cell.dataset.column = column;
        cell.textContent = mark;

        fillCell(cell, mark);

        return cell;
    }

    function fillCell(cell, mark) {
        cell.textContent = mark;

        if (cellMarked(mark)) {
            colorMark(cell, mark);
            disableCell(cell);
        }
    }

    const cellMarked = mark => mark === "X" || mark === "O";
    const disableCell = cell => cell.disabled = true;

    function colorMark(cell, mark) {
        if (mark === "X")
            cell.style.color = "grey";

        else if (mark === "O")
            cell.style.color = "white";
    }

    function clickHandlerBoard(event) {
        game.playTurn(getRow(event), getColumn(event));
        clearScreen();
        updateScreen();

        if (game.winner())
            boardDisplay.dispatchEvent(new Event("winner"));

        else if (game.tied())
            boardDisplay.dispatchEvent(new Event("tie"));
    }

    const getRow = event => event.target.dataset.row;
    const getColumn = event => event.target.dataset.column;

    function winnerHandlerBoard() {
        disableClickHandler();
        freezeBoard();
        displayWinner();
    }

    function enableClickHandler() {
        boardDisplay.addEventListener("click", clickHandlerBoard);
    }

    function disableClickHandler() {
        boardDisplay.removeEventListener("click", clickHandlerBoard);
    }

    function freezeBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.disabled = true);
    }

    function displayWinner() {
        const winningPlayer = game.getCurrentPlayer();
        winningPlayer.mark === "X" ? crossesDialog.showModal() : noughtsDialog.showModal();    
    }

    function tieHandlerBoard() {
        disableClickHandler();
        displayTie();
    }

    const displayTie = () => tieDialog.showModal();

    boardDisplay.addEventListener("click", clickHandlerBoard);
    boardDisplay.addEventListener("winner", winnerHandlerBoard);
    boardDisplay.addEventListener("tie", tieHandlerBoard);

    const loadedHandlerDialog = () => menuDialog.showModal();

    function submitHandlerDialog(event) {
        event.preventDefault();

        setPlayer1Name(getPlayer1Name());
        setPlayer2Name(getPlayer2Name());
        closeDialog(menuDialog);
    }

    const getPlayer1Name = () => document.getElementById("player1-name").value;
    const getPlayer2Name = () => document.getElementById("player2-name").value;
    const closeDialog = dialog => dialog.close();

    const setPlayer1Name = name => document.querySelector(".player1").lastElementChild.textContent = name;
    const setPlayer2Name = name => document.querySelector(".player2").lastElementChild.textContent = name;

    document.addEventListener("DOMContentLoaded", loadedHandlerDialog);
    menuForm.addEventListener("submit", submitHandlerDialog);

    function clickHandlerDialog() {
        if (crossesDialog.open) closeDialog(crossesDialog);
        if (noughtsDialog.open) closeDialog(noughtsDialog);
        if (tieDialog.open) closeDialog(tieDialog);
    }

    document.querySelectorAll(".restart").forEach(restartButton => {
        restartButton.addEventListener("click", clickHandlerDialog);
    });

    updateScreen();
}

createDisplayController()