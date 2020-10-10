const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

var indexRouter = require('./routes/index');

const app = express();

app.get('/', (req, res, next) => {
    res.send('hello world');
})

app.use(cors({
    origin: "http://localhost:3000/",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRouter);

app.listen(8080, () => {
    console.log('app is running on port 8080');
})