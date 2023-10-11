require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const connectDB =require('./server/config/db');
const session = require('express-session');
const {isActiveRoute} = require('./server/helpers/routerHelper');
const methodOverride = require('method-override');

const app = express();
const port= process.env.PORT || 3000;



connectDB();


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collection: 'sessions'

    })
}));

app.use(expressLayout);
app.set('layout','./layout/main');
app.set('view engine','ejs');


app.use(express.static('public'));

app.locals.isActiveRoute = isActiveRoute;

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})





module.exports = app;