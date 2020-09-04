const express = require('express');
const socket = require('socket.io');
const path = require('path');
const app = express();
const port = process.env.port || 5000;

//middlewares
app.use(express.static(path.join(__dirname, "..", "build"))); //accesses react stuff
app.use(express.static('../app/public'));



const server = app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
});

const io = socket(server);

