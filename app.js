const express = require('express');

const userRouter = require('./routes/userRoutes');
const noteRouter = require('./routes/noteRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

var cors = require('cors');
const app = express();

app.use(cors());


//to pass json files as response
app.use(express.json());


app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


// 3) ROUTES
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;