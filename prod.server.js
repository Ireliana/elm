const express = require('express');
const config = require('./config/index');

const port = process.env.PORT || config.build.port;

const app = express();

const route = express.Router();

route.get('/', (req, res, next) => {
  req.url = './index.html';
  next();
});

app.use(route);

const appData = require('./data.json');

const seller = appData.seller;
const goods = appData.goods;
const ratings = appData.ratings;

app.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller,
  });
});
app.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods,
  });
});
app.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings,
  });
});

app.use(express.static('./dist'));

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;    
  }
  console.log(`> Listening at http://localhost:${port}`);   
});
