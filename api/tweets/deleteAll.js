const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');

/*
 * Function for save data in mongodb
 */
async function deleteAll() {
    return new Promise((resolve, reject) => {
        const uri =
            'mongodb+srv://admin:rRe2aqlAL73oNgxf@cluster0.pelwj.mongodb.net/twitter?retryWrites=true&w=majority';
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const dbName = 'twitter';

        client.connect().then((client) => {
            const db = client.db(dbName);
            db.collection('tweets', function(err, collection) {
                if (err) {
                    console.log('err', err);
                }
                collection.deleteMany({});
                resolve();
            });
        });
    });
}

module.exports = async(req, res) => {
    var data = await deleteAll();
    res.send(data);
};