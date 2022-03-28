const express = require('express');

const app = express();

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('listening...');
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index.html');
});

/*

Zenquotes

6. Request quotes by keyword

To filter quotes by keyword, simply add &keyword=[keyword] to the end of your request.
For example: https://zenquotes.io/api/quotes/[YOUR_API_KEY]&keyword=happiness would return a maximum of 50 random quotes matching the keyword “happiness”.
To see a list of keywords currently supported, visit the following link: https://zenquotes.io/keywords

*/