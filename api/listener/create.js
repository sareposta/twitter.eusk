const MongoClient = require('mongodb').MongoClient;

/*
 * Function for save data in mongodb
 */
async function saveDataInMongo(data) {
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
            db.collection('listeners').insertOne(data, function(err, r) {
                resolve();
                if (err) {
                    console.log(err);
                }
            });
        });
    });
}

module.exports = async(req, res) => {
    saveDataInMongo(req.body);
    res.send(req.body);
};