const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');

/*
 * Function for save data in mongodb
 */
async function updateDataInMongo(data) {
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
            var id = data._id;
            delete data._id;
            db.collection('listeners').updateOne({ _id: new mongodb.ObjectID(id) }, { $set: data }, // Update
                () => {
                    resolve(data);
                }
            );
        });
    });
}

module.exports = async(req, res) => {
    updateDataInMongo(req.body);
    res.send(req.body);
};