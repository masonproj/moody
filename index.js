const express = require('express');

const app = express();

const server = app.listen(process.env.PORT || 8080, () => {
    console.log('listening...');
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index.html');
});
