const databast  =   require('./config/db');
const  express  =   require('express');
const    app    =   express();
const    auth   =   require('./routes/authentication');
const   detect  =   require('./routes/detect');


app.use(express.json());
app.use('/',auth);
app.use('/',detect);
app.get('/',(req,res)=>{
  return res.send('<h1><pre> W E L C O M E   T O  A R A B  C H A T </pre></h1>')
});


module.exports = app;