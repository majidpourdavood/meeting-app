const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const errorHandler = require('./util/error-handler');

const authRouteApi = require('./routes/api/auth');
const meeting = require('./routes/api/meeting')

require("dotenv").config({
    path: path.join(__dirname, "/.env")
});


const app = express();

const dbName = "sesamimajid";
const MONGODB_URI = "mongodb://127.0.0.1:27017" + "/" + dbName;


const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',

});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const panelRoutes = require('./routes/panel');
const viewRoutes = require('./routes/view');
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({limit: '15mb', extended: true}));

app.use(bodyParser.json()); // application/json



app.use(express.static(path.join(__dirname, '/public')));
app.use('/public/images', express.static(path.join(__dirname, '/public/images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(
    session({
        secret: 'dssxdbfhbftghn',
        resave: false,
        saveUninitialized: false,
        store: store,
        // maxAge: new Date(Date.now() + 5184000000), // 60 days
        // expires: new Date(Date.now() + 5184000000), // 60 days

    })
);

//api route

;
app.use('/api', authRouteApi);
app.use('/api', meeting);


app.use(errorHandler);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});



app.use('/panel', panelRoutes);
app.use(viewRoutes);
app.use(auth);
//


app.use(errorController.get404);


app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        error: error.toString(),
        isAuthenticated: req.session.isLoggedIn
    });
});





mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {


        var port = 3000;
        server = app.listen(port, function () {
        });
        let interval;


    })
    .catch(err => {
        console.log(err);
    });

