const express = require('express')
const server = require('./server')
const cors = require("cors");

const app = express()

const corsOptions = {
    // origin: 'https://exam.andragogy.fr',
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}

const baseUrl = '' 

app.use(`${baseUrl}/`,server)
app.use(cors(corsOptions))

app.get(`${baseUrl}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
app.listen(3000, () => {
    console.info('server démarré')
})