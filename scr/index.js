require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
