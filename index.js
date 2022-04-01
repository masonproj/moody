const fetch = require('node-fetch');
const path = require('path');
const express = require('express');
const app = express();

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('listening...');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/randomQuote', async function (req, res) {
    let apiAddress = 'https://zenquotes.io/api/random';
    const response = await fetch(apiAddress);
    const result = await response.json();
    res.send(result[0].q);
});

/*

Zenquotes

6. Request quotes by keyword

To filter quotes by keyword, simply add &keyword=[keyword] to the end of your request.
For example: https://zenquotes.io/api/quotes/[YOUR_API_KEY]&keyword=happiness would return a maximum of 50 random quotes matching the keyword “happiness”.
To see a list of keywords currently supported, visit the following link: https://zenquotes.io/keywords

*/
