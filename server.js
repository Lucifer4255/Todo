const mongoose = require('mongoose');
const env = require('dotenv');
const app= require('./app');


//load env variables
env.config();

const port = process.env.PORT || 8080;

const db = process.env.DB.replace('<password>',process.env.PASSWORD);

mongoose.connect(db, {
    useUnifiedTopology: true,
}).then(()=>console.log('DB connection established'));



app.listen(port,()=>{
    console.log('listening on port ' + port);
});
