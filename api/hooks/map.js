var axios = require('axios');
var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var host = 'https://nuxtjs.santiblanko.vercel.app';
/*
 * Función para obtener escuchadores
 */
async function getListeners(data) {
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
    // obtenemos los escuchadores
    var listeners = await getListeners();
    // hacemos la petición http a los diferentes listeners
    listeners.forEach((listener) => {
        try {
            var data = axios.post(host + '/api/hooks/worker', listener);
        } catch (error) {
            console.log('error al capturar', listener.name);
        }
    });

    res.send({
        status: 'success',
    });
};