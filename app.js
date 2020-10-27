const databast  =   require('./config/db');
const  express  =   require('express');
const    app    =   express();
const    auth   =   require('./routes/authentication');
const   detect  =   require('./routes/detect');


app.use(express.json());
app.use('/',auth);
app.use('/',detect);


module.exports = app;