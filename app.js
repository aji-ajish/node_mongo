const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');
pp.use(bodyParser.urlencoded({extended}))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const database = await dbo.getDataBase();
    const collection = database.collection('books');
    const cursor = collection.find({});
    const employee = await cursor.toArray();

    const message = '';
switch (req.query.status) {
    case 1:
        message='inserted succesfully'
        break;

    default:
        break;
}

    res.render('main', { message, employee });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/store_book',async(req,res)=>{
    const database = await dbo.getDataBase();
    const collection = database.collection('books');
    let book={title:req.body.title,author:req.author}
   await collection.insertOne(book)
return res.redirect('/?status=1')
})

app.listen(8000, () => {
  console.log('Listening on port 8000');
});
