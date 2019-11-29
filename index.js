import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';

const morgan = require('morgan');
const app = express();
const PORT = 3000;

app.use(morgan('dev'));

// mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/MusicHub', {
    useNewUrlParser: true,
    useCreateIndex: true 
});

// bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

// static files
app.use(express.static('/images'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

// Errors
app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

// cross origin headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);

