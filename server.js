const express = require('express');
const app = express();
const logger = require('./logger'); 
const port = 3000;

app.use(logger);

app.use(express.static('public'));

app.get('/api/message', (req, res) => {
    const message = 'Successfully logs your request!';
    res.json({ message });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
