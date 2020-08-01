var MongoClient = require('mongodb').MongoClient;

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'ahZSD2H5KgRoccxpbqheD3q6p',
    consumer_secret: 'Eev45Ok7Nxah8c5bDolZJvqtQi022NmsKaTEz2VnL4I5aC4Oi5',
    access_token_key: '210879107-ObklOzIKcTRajTWBX7onK0gjWZsGQGDXDgLty6Fm',
    access_token_secret: 'ZjGGz7q7tOTsggdSPto2uJmVUs5QMYqDAAfQjJvahA7le',
});

module.exports = async(req, res) => {
    if (!req.body.id) {
        res.send({
            status: 'error',
            message: 'No id in the request',
        });
        return;
    }

    /*
     * Elimina las colecciones
     */
    client.post('https://api.twitter.com/1.1/collections/destroy.json?id=custom-' + req.body.id, function() {
        res.send({
            status: 'success',
            message: 'Deleted',
        });
    });
};