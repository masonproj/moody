require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { response } = require('express');
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

app.get('/', (req, res) => {
    res.render('index');
});

//GET DATA FROM FORM
app.post('/', function (req, res) {
    console.log(req.body);

    //Just responds with the index again. Can check if there was data in req.body and if true also respond with a confirmation variable or the entry list page
    res.render('index');
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

app.get('/mood', async function (req, res) {
    let dummyRequest = {
        mood: 'happy',
        description: 'this is a description',
        quote: 'true',
        video: 'true',
    };

    // req.body.quote or video
    if (dummyRequest.quote) {
        let result = await fetch('http://localhost:8080/dailyQuote');
        let quote = await result.text();
        dummyRequest.quote = quote;
    }

    if (dummyRequest.video) {
        let result = await fetch('http://localhost:8080/videoTest');
        let video = await result.text();
        dummyRequest.video = video;
    }

    res.render('mood', dummyRequest);
});

app.get('/history', (req, res) => {
    let dummyHistory = [
        {
            mood: 'happy',
            description: 'this is a description',
            quote: 'this is a quote',
        },
        {
            mood: 'sad',
            description: 'this is a description',
            video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZbZSe6N_BXs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
        },
        {
            mood: 'joyful',
            description: 'this is a description',
            quote: 'this is a quote',
            video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZbZSe6N_BXs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
        },
        {
            mood: 'happy',
            description: 'this is a description',
        },
    ];

    res.render('history', { dummyHistory });
});

app.get('/dailyQuote', async function (req, res) {
    let apiAddress = 'https://zenquotes.io/api/today';
    const response = await fetch(apiAddress);
    const result = await response.json();
    res.send(result[0].q);
});

app.get('/videoTest', async function (req, res) {
    let apiAddress = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=happy&key=' + API_KEY;
    const response = await fetch(apiAddress);
    const result = await response.json();

    res.send(
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
            result.items[0].id.videoId +
            '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    );
});
/*
 */
