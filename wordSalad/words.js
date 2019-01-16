var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var readline = require('readline');
var axios = require('axios');

var api = express();

api.use(cors());
api.use(logger('dev'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended:false}));

let nonsense = [];
let startingLetters = ['a','p','n'];

var rl = readline.createInterface(process.stdin, process.stdout);
rl.question = ('enter three parts of speech separated by spaces where: n = noun, adj = adjective');
rl.on('line', (line) => {
    const partsOfSpeech = line.split(' ');
    if (partsOfSpeech.length === 3) {
        getWords(partsOfSpeech)
        .then(result => 
            result.map((response, index) => {
                return response.data.filter(item => 
                    item.tags && item.tags.includes(partsOfSpeech[index]))
            }))
            .then(filteredResults => 
                filteredResults.map(words => {
                if(Array.isArray(words)) {
                    const rand = Math.floor(Math.random() * words.length)
                    console.log("CHOSEN: ", words[rand]);
                    }
                }
            ))
            .catch(err => console.log(err));
    }
});

async function getWords(partsOfSpeech) {
    let wordPromises = [];
    for(i = 0; i < startingLetters.length; i++){
        let url = `https://api.datamuse.com/words?sp=${startingLetters[i]}*&&md=p`;
        wordPromises.push(axios.get(url))
    }
    return await Promise.all(wordPromises)
}

console.log("server started");
module.exports = api;