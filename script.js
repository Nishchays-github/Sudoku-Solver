let btn = document.querySelector('.solver');
btn.addEventListener("click", game);

let rest = document.querySelector('.reset');
rest.addEventListener("click", newgame); 

function game() {
    let arr = [];
    let box = document.querySelector('.sudoku-board');
    for (let i = 0; i < 9; i++) {
        let row = [];
        let box_no = box.children[i];
        for (let j = 0; j < 9; j++) {
            let box_ele = box_no.children[j];
            let value = parseInt(box_ele.querySelector('input').value);
            if (!isNaN(value) && value >= 1 && value <= 9) {
                row.push(value);
            } else {
                row.push(-1);
            }
        }
        arr.push(row);
    }
    
    const solver = new SudokuSolver(arr);
    if (solver.checkInput()) {
        solver.solveSudoku();
    } else {
        return ;
    }
}

class SudokuSolver {
    constructor(board) {
        this.board = board;
    }

    checkInput() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let check = this.correction_for_user(i, j, this.board[i][j]);
                if (this.board[i][j] !== -1 && check !== "") {
                    alert(`Don't input same value in the same ${check}`);
                    return false;
                }
            }
        }
        return true;
    }

    correction_for_user(row, col, ch) {
        const { board } = this;
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === ch && i !== col) {
                return "row";
            }
            if (board[i][col] === ch && i !== row) {
                return "columnn";
            }
            const startRow = 3 * Math.floor(row / 3);
            const startCol = 3 * Math.floor(col / 3);
            if (board[startRow + Math.floor(i / 3)][startCol + (i % 3)] === ch && (startRow + Math.floor(i / 3) !== row || startCol + (i % 3) !== col)) {
                return "box";
            }
        }
        return "";
    }

    canfit(row, col, ch) {
        const { board } = this;
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === ch && i !== col) {
                return false;
            }
            if (board[i][col] === ch && i !== row) {
                return false;
            }
            const startRow = 3 * Math.floor(row / 3);
            const startCol = 3 * Math.floor(col / 3);
            if (board[startRow + Math.floor(i / 3)][startCol + (i % 3)] === ch && (startRow + Math.floor(i / 3) !== row || startCol + (i % 3) !== col)) {
                return false;
            }
        }
        return true;
    }

    solve() {
        const { board } = this;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === -1) {
                    for (let ch = 1; ch <= 9; ch++) {
                        if (this.canfit(i, j, ch)) {
                            board[i][j] = ch;
                            if (this.solve()) {
                                return true;
                            } else {
                                board[i][j] = -1;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solveSudoku() {
        if (this.solve()) {
            let box = document.querySelector('.sudoku-board');

            for (let i = 0; i < 9; i++) {
                let box_no = box.children[i];
                for (let j = 0; j < 9; j++) {
                    let box_ele = box_no.children[j];
                    box_ele.innerHTML = `<p style="font-size: xx-large;" class="cell input-css">${this.board[i][j]}</p>`;
                }
            }
            let heading = document.querySelector('h1');
            heading.innerText = "SOLVED SUDOKO";
            heading.style.color = "green"; // Change "blue" to the color you want
            
            console.log(`Your output is this `, this.board);
        } else {
            alert("No solution exists.");
        }
    }
}

function newgame(){
    window.location.reload();
}
