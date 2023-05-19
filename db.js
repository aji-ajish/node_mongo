const mongodb=require('mongodb')
const mongoClient=mongodb.mongoClient;

let database;
async function getDataBase(){
    const client=mongoClient.connect('mongodb://127.0.0.1:27017')
}