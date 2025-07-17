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
            throw new Error ("Cannot place mark on space out of bounds.");
        else if (!spaceEmpty(row, column))
            throw new Error("Cannot place mark on space which is not empty.");
        else  
            placeMark(row, column, mark);
    }

    const inBounds = (row, column) => rowInBounds(row) && columnInBounds(column);
    const rowInBounds = row => row >= 0 && row <= ROWS - 1;
    const columnInBounds = column => column >= 0 && column <= COLUMNS - 1;
    const spaceEmpty = (row, column) => board[row][column] === EMPTY;
    const placeMark = (row, column, mark) => board[row][column] = mark;

    return { getBoard, markSpace };
}

function createGameController() {
    const PLAYER_ONE_MARK = 'X';
    const PLAYER_TWO_MARK = 'O';

    const PLAYER_ONE = createPlayer("Player 1", PLAYER_ONE_MARK);
    const PLAYER_TWO = createPlayer("Player 2", PLAYER_TWO_MARK);

    const board = createGameboard();

    let currentPlayer = PLAYER_ONE;
    let running = true;

    const gameInProgress = () => running;
    const endGame = () => running = false;

    function createPlayer(name, mark) {
        return { name, mark };
    }

    function nextPlayerTurn() {
        currentPlayer = (currentPlayer === PLAYER_ONE) ? PLAYER_TWO : PLAYER_ONE;
    }

    function playGame() {
        while (gameInProgress()) {
            startTurn();
            playTurn();
            endTurn();
        }

        announceResults();
    }


    function startTurn() {
        console.log(JSON.stringify(board.getBoard()));
        console.log(`${currentPlayer.name}'s turn!`);
    }

    function playTurn() { 
        do {
            const row = parseInt(prompt("Row: "));
            const column = parseInt(prompt("Column: "));

            try {
                board.markSpace(row, column, currentPlayer.mark);
                break;
            }
            catch (error) {
                console.error(error.message);
            }

        } while(true);
    }

    function endTurn() {
        win() || tie() ? endGame() : nextPlayerTurn();
    }

    function announceResults() {
        win() ? announceWinner() : announceTie();
    }

    function announceWinner() {
        console.log(board.getBoard());
        console.log(`${currentPlayer.name} wins!`);
    }

    function announceTie() {
        console.log(board.getBoard());
        console.log("Tie!");
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

    return { playGame };
}