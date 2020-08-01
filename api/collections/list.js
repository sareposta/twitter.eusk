var MongoClient = require('mongodb').MongoClient;

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'ahZSD2H5KgRoccxpbqheD3q6p',
    consumer_secret: 'Eev45Ok7Nxah8c5bDolZJvqtQi022NmsKaTEz2VnL4I5aC4Oi5',
    access_token_key: '210879107-ObklOzIKcTRajTWBX7onK0gjWZsGQGDXDgLty6Fm',
    access_token_secret: 'ZjGGz7q7tOTsggdSPto2uJmVUs5QMYqDAAfQjJvahA7le',
});

module.exports = async(req, res) => {
    /*
     * Lista las colecciones
     */
    client.get('/collections/list.json?screen_name=santiblanko&count=10000', function(error, list, a) {
        res.send(list)
    });
};