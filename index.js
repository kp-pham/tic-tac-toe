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
        if (spaceEmpty(row, column))
            placeMark(row, column, mark);
        else
            console.log("Cannot place mark on space which is not empty.");
    }

    const spaceEmpty = (row, column) => board[row][column] === EMPTY;
    const placeMark = (row, column, mark) => board[row][column] = mark;
    

    return { board, getBoard, markSpace };
}