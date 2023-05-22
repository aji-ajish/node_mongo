const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const database = await dbo.getDataBase();
    const collection = database.collection('books');
    const cursor = collection.find({});
    const employee = await cursor.toArray();
    const message = '';
    res.render('main', { message, employee });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(8000, () => {
  console.log('Listening on port 8000');
});
