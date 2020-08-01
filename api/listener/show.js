const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');

/*
 * Function for save data in mongodb
 */
async function getData(id) {
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
            db.collection('listeners')
                .findOne({ _id: new mongodb.ObjectID(id) }, function(err, r) {
                    if (err) {
                        console.log(err);
                    }

                    resolve(r);
                })
        });
    });
}

module.exports = async(req, res) => {
    console.log("req.pra", req.query.id)
    var data = await getData(req.query.id);
    res.send(data);
};