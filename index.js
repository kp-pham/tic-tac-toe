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
    const board = createGameboard();
}