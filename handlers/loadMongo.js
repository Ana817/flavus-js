const mongoose = require('mongoose');


module.exports = (client) => {

    mongoose.connect(process.env.MONGODB_SRV, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
    }).then(() => {
        client.clog('Connected to MongoDB!'.log);
    }).catch(err => {
        client.clog('Error connecting to MongoDB: '.error + String(err.message).error);
    });
    
}