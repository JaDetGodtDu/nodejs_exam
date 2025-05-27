import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const databaseName = process.env.MONGODB_DB;

await client.connect();

const db = client.db(databaseName);

export default {
    db,
    pets: db.collection('pets'),
    users: db.collection('users'),
}