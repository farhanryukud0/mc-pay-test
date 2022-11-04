const readline = require('readline');
const {iterateeAry} = require("lodash/fp/_mapping");
const {compile} = require("morgan");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let answerList = {};
let iteration = 0;
const dataTest = {
    '0': [
        '5 3 4 6 7 8 9 1 2',
        '6 7 2 1 9 5 3 4 8',
        '1 9 8 3 4 2 5 6 7',
        '8 5 9 7 6 1 4 2 3',
        '4 2 6 8 5 3 7 9 1',
        '7 1 3 9 2 4 8 5 6',
        '9 6 1 5 3 7 2 8 4',
        '2 8 7 4 1 9 6 3 5',
        '3 4 5 2 8 6 1 7 9'
        ],
    '1': [
        '2 8 6 9 4 5 1 7 3',
        '7 1 4 6 3 2 9 5 8',
        '9 3 5 7 8 1 4 2 6',
        '4 2 7 3 5 6 8 1 9',
        '6 5 8 1 9 7 3 4 2',
        '1 9 3 4 2 8 7 6 5',
        '3 6 1 5 7 9 2 8 4',
        '5 4 2 8 1 3 6 9 7',
        '8 7 9 2 6 4 5 3 1'
    ]
}
const inputUser = function () {
    rl.question("Total Case : ", async function (answer) {
        if (!/^[1-9]*$/.test(answer)) {
            console.log('please only input number minimal 1 without space !');
            rl.close();
        } else {
            while (iteration < answer) {
                console.log('please input 9 number seperate by space (ex: 1 2 3 4 5 6 7 8 9) !');
                answerList[iteration] = [];
                await userInput(iteration, 1);
                iteration++;
            }
            processResult();
            rl.close();
        }
    });
}

const processResult = function () {
    for (const [index, testCase] of Object.entries(answerList)) {
        try {
            const column = {};
            const subSquare = {};
            for (const [i, row] of Object.entries(testCase)) {
                const rowTest = row.split(' ');
                let subCol = Math.ceil((parseInt(i)+1)/3);
                if(subCol == 2) subCol+=2; //untuk menentukan subsquare apabila mulai dari baris ke 4 maka start dari subCol 4
                if(subCol == 3) subCol+=4; //untuk menentukan subsquare apabila mulai dari baris ke 7 maka start dari subCol 7

                if (rowTest.length !== 9 || //apabila jumlah input tidak sama dengan 9
                    rowTest.filter(e => /[0-9 ]+/.test(e)).length !== 9 || //apabila yang diinput ada yg bukan merupakan angka/tidak sesuai format
                    [...new Set(rowTest)].length !== 9 //apabila yang diinput angkanya tidak unique
                ) throw new Error('Invalid');

                for (const [j, col] of Object.entries(rowTest)) {
                    if (typeof column[j] == 'undefined') column[j] = []
                    column[j].push(col);
                    let iterCol = subCol;
                    if(j > 5)
                        iterCol += 2; //untuk menentukan subsquare apabila mulai column 6 maka subcol + 2
                    else if (j > 2)
                        iterCol += 1; //untuk menentukan subsquare apabila mulai column 3 maka subcol + 1

                    if (typeof subSquare[iterCol] == 'undefined') subSquare[iterCol] = []
                    subSquare[iterCol].push(col);
                }
            }
            for (const [idx, rowColumn] of Object.entries(column)) {
                if ([...new Set(rowColumn)].length !== 9 //apabila yang diinput secara kolom angkanya tidak unique
                ) throw new Error('Invalid');
            }
            for (const [idx, square] of Object.entries(subSquare)) {
                if ([...new Set(square)].length !== 9 //apabila yang diinput berdasarkan square 3x3 angkanya tidak unique
                ) throw new Error('Invalid');
            }
            console.log('Valid');
        } catch (e) {
            console.log(e.message);
        }
    }
    return 1;
}
const userInput = async function (iteration, row) {
    return new Promise(resolve => {
        const waitForUserInput = function (iteration, row) {
            rl.question(`Test Case ${iteration + 1} Row ${row} of 9: `, function (answer) {
                answerList[iteration].push(answer);
                if (row === 9) {
                    resolve();
                } else {
                    row++;
                    waitForUserInput(iteration, row);
                }
            });
        }
        waitForUserInput(iteration, row);
    })
}

rl.question("ketik 1 untuk test case, ketik 2 untuk new case: ", async function (answer) {
    if(!['1','2'].includes(answer)){
        console.log('Hanya bisa pilih 1 atau 2 !');
        rl.close();
    }
    if(answer == '1'){
        answerList = dataTest;
        processResult();
    }else{
        inputUser();
    }
});
