const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');

/*
 * Function for save data in mongodb
 */
async function deleteListener(id) {
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
            db.collection('listeners', function(err, collection) {
                if (err) {
                    console.log('err', err);
                }
                collection.deleteOne({ _id: new mongodb.ObjectID(id) });
                resolve();
            });
        });
    });
}

module.exports = async(req, res) => {
    var data = await deleteListener(req.body.id);
    res.send(data);
};