const MongoClient = require('mongodb').MongoClient;

/*
 * Function for save data in mongodb
 */
async function getData(data) {
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
            db.collection('tweets')
                .find({})
                .toArray(function(err, r) {
                    if (err) {
                        console.log(err);
                    }

                    resolve(r);
                });
        });
    });
}

module.exports = async(req, res) => {
    var data = await getData();
    res.send(data);
};