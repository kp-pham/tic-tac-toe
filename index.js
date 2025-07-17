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

    const markSpace = function (row, column, mark) {
        if (!inBounds(row, column))
            console.log("Cannot place mark on space out of bounds.");
        else if (!spaceEmpty(row, column))
            console.log("Cannot place mark on space which is not empty.");
        else  
            placeMark(row, column, mark);
    }

    const inBounds = (row, column) => rowInBounds(row) && columnInBounds(column);
    const rowInBounds = row => row >= 0 && row <= ROWS - 1;
    const columnInBounds = column => column >= 0 && column <= COLUMNS - 1;
    const spaceEmpty = (row, column) => board[row][column] === EMPTY;
    const placeMark = (row, column, mark) => board[row][column] = mark;

    return { board, getBoard, markSpace };
}

function createGameController() {
    const PLAYER_ONE_MARK = 'X';
    const PLAYER_TWO_MARK = 'O';

    const PLAYER_ONE = createPlayer("Player 1", PLAYER_ONE_MARK);
    const PLAYER_TWO = createPlayer("Player 2", PLAYER_TWO_MARK);

    const board = createGameboard();

    let currentPlayer = PLAYER_ONE;
    let gameInProgress = true;

    function createPlayer(name, mark) {
        return { name, mark };
    }

    function nextPlayerTurn() {
        currentPlayer = (currentPlayer === PLAYER_ONE) ? PLAYER_TWO : PLAYER_ONE;
    }

    function playGame() {
        while (gameInProgress) {
            playTurn();
            winCondition() ? gameInProgress = false : nextPlayerTurn();
        }

        console.log(board.getBoard());
        console.log(`${currentPlayer.name} wins!`);
    }

    function playTurn() { 
        console.log(JSON.stringify(board.getBoard()));
        console.log(`${currentPlayer.name}'s turn!`);

        const row = parseInt(prompt("Row: "));
        const column = parseInt(prompt("Column: "));
        
        board.markSpace(row, column, currentPlayer.mark);
    }

    function winCondition() {
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

    return { playGame };
}