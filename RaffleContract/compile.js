const path = require('path');
const fs = require('fs');
const solc = require('solc');

const RaffleGamePath = path.resolve(__dirname, 'contract', 'RaffleGame.sol');
const source = fs.readFileSync(RaffleGamePath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'RaffleGame.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['RaffleGame.sol'].Raffle;