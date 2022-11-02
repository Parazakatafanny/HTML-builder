const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { EOL } = require('os');

const rl = readline.createInterface({input: process.stdin});

process.on('SIGINT', () => {
    onExit();
});

function onExit() {
    rl.close();
    console.log('Bye!');
}

console.log("Hello there!");

const filePath = path.join(__dirname, 'text.txt');
fs.rm(filePath, () => {
    fs.open(filePath, 'w', (err, fd) => {
        const writableStream = fs.createWriteStream(null, { fd });

        rl.on('line', (input) => {
            if (input === 'exit') {
                onExit();
            }

            writableStream.write(input);
            writableStream.write(EOL);
        });
    });
});