const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectId = dbo.ObjectId
app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const database = await dbo.getDataBase();
        const collection = database.collection('books');
        const cursor = collection.find({});
        const book = await cursor.toArray();

        let message = '';
        let edit_id, edit_book;

        if (req.query.edit_id) {
            edit_id = req.query.edit_id
            edit_book = await collection.findOne({ _id:new ObjectId(edit_id) })
        }
        if(req.query.delete_id){
           await collection.deleteOne({ _id:new ObjectId(req.query.delete_id) })
        return res.redirect('/?status=3')
        }

        switch (req.query.status) {
            case '1':
                message = 'Inserted successfully';
                break;
            case '2':
                message = 'Updated successfully';
                break;
            case '3':
                message = 'Deleted successfully';
                break;
            default:
                break;
        }

        res.render('main', { message, book, edit_book, edit_id });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/store_book', async (req, res) => {
    try {
        const database = await dbo.getDataBase();
        const collection = database.collection('books');
        let book = { title: req.body.title, author: req.body.author };
        await collection.insertOne(book);
        return res.redirect('/?status=1');
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update_book/:edit_id', async (req, res) => {
    try {
        const database = await dbo.getDataBase();
        const collection = database.collection('books');
        let book = { title: req.body.title, author: req.body.author };
        let edit_id=req.params.edit_id
        await collection.updateOne({_id:new ObjectId(edit_id)},{$set:book});
        return res.redirect('/?status=2');
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});
