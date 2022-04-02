require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const API_KEY = process.env.API_KEY;

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('listening...');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET DATA FROM FORM
app.post('/submitMood', async function (req, res) {
    let request = {
        mood: req.body.mood,
        description: req.body.description,
        quote: req.body.quote,
        video: req.body.video,
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

    res.send('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + result.items[0].id.videoId + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
});
