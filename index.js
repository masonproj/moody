require('dotenv').config();
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { nextTick } = require('process');
const app = express();

const API_KEY = process.env.API_KEY;

let dummyHistory = [
    {
        entryId: 0,
        mood: 'Joyful',
        description: 'Today was overall a good day',
        quote: 'When you are talented you do it whatever it is until your fingers bleed or your eyes are ready to fall out of your head.',
    },
    {
        entryId: 1,
        mood: 'Sad',
        description: 'I ruined my favourite shirt.',
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/-GXfLY4-d8w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
    },
    {
        entryId: 2,
        mood: 'Joyful',
        description: 'I was in a good mood today',
        quote: 'Your friends will know you better in the first minute you meet than your acquaintances will know you in a thousand years.',
        video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/I7fA8hdrqp8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
    },
    {
        entryId: 3,
        mood: 'Anxious',
        description: '',
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

let currentUser;

let dummyUsers = [
    {
        username: 'john',
        password: 'thisismypass',
    },
    {
        username: 'blade',
        password: '123456',
    },
    {
        username: 'myuser',
        password: '102030#yes',
    },
];

const checkLogin = (req, res, next) => {
    if (currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/', checkLogin, function (req, res) {
    res.render('index', { currentUser });
});

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
        let result = await fetch('https://moody-moodtracker.herokuapp.com/dailyQuote');
        let quote = await result.text();
        request.quote = quote;
    }

    if (request.video) {
        let result = await fetch('https://moody-moodtracker.herokuapp.com/videoTest/' + req.body.mood);
        let video = await result.text();
        request.video = video;
    }
    dummyHistory.push(request);
    console.log(request)
    res.render('mood', { request, currentUser } );
});

app.get('/randomQuote', async function (req, res) {
    let apiAddress = 'https://zenquotes.io/api/random';
    const response = await fetch(apiAddress);
    const result = await response.json();
    res.send(result[0].q);
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    dummyUsers.filter((user) => {
        if (username === user.username && password === user.password) {
            currentUser = user;
            res.redirect('/');
        }
    });

    if (!currentUser) {
        res.render('login', { message: 'Invalid username or password' });
    }
});

app.get('/history', (req, res) => {

    res.render('history', { dummyHistory, currentUser });
});

app.get('/newVideo/:entryId/:mood', async function(req, res) {
    let entryId = req.params.entryId;
    let result = await fetch('https://moody-moodtracker.herokuapp.com/videoTest/' + req.params.mood);
    let video = await result.text();
    dummyHistory[entryId].video = video;

    res.render('history', { dummyHistory })
})

app.get('/newQuote/:entryId', async function(req, res) {
    let entryId = req.params.entryId;
    let result = await fetch('https://moody-moodtracker.herokuapp.com/randomQuote');
    let quote = await result.text();
    dummyHistory[entryId].quote = quote;

    res.render('history', { dummyHistory })
})

app.get('/quote', async function(req, res) {
    let result = await fetch('https://moody-moodtracker.herokuapp.com/randomQuote');
    let data = await result.text();

    res.render('quote',{ data, currentUser })    
});

app.get('/video', async function(req, res) {
    let mood;
    switch (getRandomInt(5)) {
        case 0:
          mood = "Anxious";
          break;
        case 1:
          mood = "Joyful";
          break;
        case 2:
          mood = "Calm";
          break;
        case 3:
          mood = "Reflective";
          break;
        case 4:
          mood = "Restless";
          break;
        case 5:
          mood = "Sad";
    };
    let apiAddress = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=' + mood + '+tips+motivation&key=' + API_KEY;
    const response = await fetch(apiAddress);
    const result = await response.json();
    let data = 
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
            result.items[getRandomInt(24)].id.videoId +
            '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    res.render('video',{ data, currentUser })    
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

    res.send(
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
            result.items[getRandomInt(24)].id.videoId +
            '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    );
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
