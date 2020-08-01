var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var moment = require('moment');

var client = new Twitter({
    consumer_key: 'ahZSD2H5KgRoccxpbqheD3q6p',
    consumer_secret: 'Eev45Ok7Nxah8c5bDolZJvqtQi022NmsKaTEz2VnL4I5aC4Oi5',
    access_token_key: '210879107-ObklOzIKcTRajTWBX7onK0gjWZsGQGDXDgLty6Fm',
    access_token_secret: 'ZjGGz7q7tOTsggdSPto2uJmVUs5QMYqDAAfQjJvahA7le',
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function addTweetToCollection(collectionId, tweetId) {
    console.log(collectionId, tweetId, 'lol');
    var data = await client.post('https://api.twitter.com/1.1/collections/entries/add.json', {
        id: 'custom-' + collectionId,
        tweet_id: tweetId,
    });
}

/*
 * Guarda la data
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
            db.collection('tweets').insertOne(data, function(err, r) {
                resolve();
                if (err) {
                    console.log(err);
                }
            });
        });
    });
}

/*
 * Valida que exista por lista y por id de tweet.
 */
async function checkIfExist(id, collection) {
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
            db.collection('tweets').findOne({ tweet_id: id, collection: collection }, function(err, r) {
                if (err) {
                    console.log(err);
                }
                resolve(r);
            });
        });
    });
}

/*
 * Function for save data in mongodb
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
    console.time('init');

    var listener = req.body;

    var query = '';

    // todas estas palabras (q)
    if (listener.allWords) {
        query += listener.allWords;
    }

    // exact "word"
    if (listener.exactPhrase) {
        query += " '" + listener.exactPhrase + "' ";
    }

    // q=(cats OR dogs)
    if (listener.includeWords) {
        query += ' (' + listener.includeWords.split(' ').join(' OR ') + ') ';
    }

    // q=(cats AND dogs)
    if (listener.includeWords) {
        query += ' (' + listener.includeWords.split(' ').join(' AND ') + ') ';
    }

    // =-ABC ninguna de estas palabras
    if (listener.excludeWords) {
        query += ' -' + listener.excludeWords.split(' ').join(' -') + ' ';
    }

    // (#lol OR #lal) - alguno de estos hashtags
    if (listener.hashtags) {
        query += ' (' + listener.hashtags.split(' ').join(' OR ') + ') ';
    }

    // lang:cs - para seleccionar lenguaje
    if (listener.lang && listener.lang.value) {
        query += ' lang:' + listener.lang.value + ' ';
    }

    // // -filter:replies - para que no traiga las respuestas
    // if (!listener.replies) {
    //     query += '(-filter:replies) '
    // }

    // -filter:links - para que no traiga links
    // if (!listener.hyperlinks) {
    //     query += '-filter:links '
    // }

    // filter:links - solo con links
    if (listener.hyperlinks) {
        query += ' filter:links ';
    }

    // filter:replies - solo respuestas
    if (listener.onlyReplies) {
        query += ' filter:replies ';
    }

    // min_replies:12 - minimo de respuestas
    if (listener.min_replies) {
        query += ' min_replies:' + listener.min_replies + ' ';
    }

    // min_faves:12 - minimo de likes
    if (listener.min_faves) {
        query += ' min_faves:' + listener.min_faves + ' ';
    }

    // min_retweets:12 - minimo de retweets
    if (listener.min_retweets) {
        query += ' min_retweets:' + listener.min_retweets + ' ';
    }

    // since:2018-02-02 - fecha de inicio
    if (listener.startDate) {
        query += ' since:' + moment(listener.startDate).format('YYYY-MM-DD') + ' ';
    }

    // until:2018-02-04 - fecha hasta
    if (listener.endDate) {
        query += ' until:' + moment(listener.endDate).format('YYYY-MM-DD');
    }

    // (@123) - que mencione alguna de estas cuentas
    if (listener.includeAccounts) {
        query += listener.includeAccounts.split(' ').join(' OR ');
    }

    console.log('Query: ', query);
    var data = await client.get('https://api.twitter.com/1.1/search/tweets.json?count=100', { q: query });
    console.log('Results length: ', data.statuses.length);
    var tweets = data.statuses;

    console.timeEnd('init');

    await asyncForEach(tweets, async(tweet) => {
        var exist = await checkIfExist(tweet.id_str, listener.collection.label);
        if (!exist) {
            tweet.collection = listener.collection.label;
            date = new Date();
            tweet.tweet_id = tweet.id_str;
            tweet.listener = listener.name;
            tweet.list = listener.name;
            tweet.user = tweet.user.screen_name;
            tweet.tweet = tweet.text;
            saveDataInMongo(tweet);
            addTweetToCollection(listener.collection.value, tweet.tweet_id);
        }
    });

    res.send({
        status: 'started',
        data: tweets,
    });
};