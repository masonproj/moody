require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY;

let dummyHistory = [
    {
        entryId: 0,
        mood: 'happy',
        description: 'this is a description',
        quote: 'this is a quote',
    },
    {
        entryId: 1,
        mood: 'sad',
        description: 'this is a description',
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZbZSe6N_BXs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
    },
    {
        entryId: 2,
        mood: 'joyful',
        description: 'this is a description',
        quote: 'this is a quote',
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZbZSe6N_BXs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
    },
    {
        entryId: 3,
        mood: 'happy',
        description: 'this is a description',
    },
];

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('listening...');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index');
})

//GET DATA FROM FORM
app.post('/submitMood', async function (req, res) {
    let request = {
        entryId: dummyHistory.length,
        mood: req.body.mood,
        description: req.body.description,
        quote: req.body.quote,
        video: req.body.video
    };

    if (request.quote) {
        let result = await fetch('http://localhost:8080/dailyQuote');
        let quote = await result.text();
        request.quote = quote;
    }

    if (request.video) {
        let result = await fetch('http://localhost:8080/videoTest/' + req.body.mood);
        let video = await result.text();
        request.video = video;
    }
    dummyHistory.push(request)
    console.log(request);
    //Just responds with the index again. Can check if there was data in req.body and if true also respond with a confirmation variable or the entry list page
    res.render('mood', request);
});

app.get('/randomQuote', async function (req, res) {
    let apiAddress = 'https://zenquotes.io/api/random';
    const response = await fetch(apiAddress);
    const result = await response.json();
    res.send(result[0].q);
});

app.get('/login', async function (req, res) {
    res.render('login');
});

app.get('/history', (req, res) => {

    res.render('history', { dummyHistory });
});

app.get('/newVideo/:entryId/:mood', async function(req, res) {
    let entryId = req.params.entryId;
    let result = await fetch('http://localhost:8080/videoTest/' + req.params.mood);
    let video = await result.text();
    dummyHistory[entryId].video = video;

    res.render('history', { dummyHistory })
})

app.get('/dailyQuote', async function (req, res) {
    let apiAddress = 'https://zenquotes.io/api/today';
    const response = await fetch(apiAddress);
    const result = await response.json();
    res.send(result[0].q);
});

app.get('/videoTest/:mood', async function (req, res) {
    let mood = req.params.mood;
    let apiAddress = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=' + mood + '+tips+motivation&key=' + API_KEY;
    const response = await fetch(apiAddress);
    const result = await response.json();

    res.send('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + result.items[getRandomInt(24)].id.videoId + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}