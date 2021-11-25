require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const apiRoutes = require('./api/routes/index');

app.use(cors());
app.use(express.json());

app.use(apiRoutes);

const server = app.listen(process.env.PORT || 3001, function() {
    console.log('Server is listening at http://' + server.address().address + ':' + server.address().port);
})