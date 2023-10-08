require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');


const app = express();
const port= process.env.PORT || 3000;





app.use(expressLayout);
app.set('layout','./layout/main');
app.set('view engine','ejs');

app.use('/',require('./server/routes/main'));
app.use(express.static('public'));
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})


module.exports = app;






module.exports = app;