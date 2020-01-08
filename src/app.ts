
require('dotenv-safe').config({
    path: process.env.DOTENV_PATH ? process.env.DOTENV_PATH : '.env'
});
// to avoid undeclared TS messages
declare const process: { env: { [key: string]: string; } };

import * as http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require ('cors');
const compression = require('compression');
const logger = require('morgan');
const createError = require('http-errors');
const debug = require('debug')('rest-ts-node');

// Create a new express application instance.
const app: express.Application = express();

app.use(helmet());
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false })); // I saw this as true in https://www.robinwieruch.de/node-express-server-rest-api/
app.use(cookieParser());
app.use(compression());

if (process.env.MOCHA_TESTS !== 'true') {
    app.use(logger('dev'));
}

app.use(cors());
app.options('*', cors());

import jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
    }),
    audience: process.env.AUDIENCE,
    issuer: 'https://' + process.env.AUTH0_DOMAIN + '/',
    algorithms: ['RS256']
});

// CONFIGURE ROUTES - PUBLIC AND PRIVATE
const publicRoutes = require ('./routes/public');
const privateRoutes = require ('./routes/private');
const adminRoutes = require ('./routes/admin');

app.use('/rest/public', publicRoutes);
app.use('/rest/private', jwtCheck, privateRoutes);
app.use('/rest/admin', jwtCheck, adminRoutes);

// Error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');

    res.json( {statusCode: err.status, message: err.message})
});

const server: http.Server = app.listen(parseInt(process.env.REST_SERVER_PORT), () => {
    console.log("Server running on port", process.env.REST_SERVER_PORT);
});

// Catch and output startup errors to help debug
server.on('error', onError);
server.on('listening', onListening);

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof parseInt(process.env.REST_SERVER_PORT) === 'string'
        ? 'Pipe ' + parseInt(process.env.REST_SERVER_PORT)
        : 'Port ' + parseInt(process.env.REST_SERVER_PORT);

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            throw new Error(bind + ' requires elevated privileges');
            //process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            throw new Error(bind + ' is already in use');
            //process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + ( addr ? addr.port : 'undefined' );
    debug('Listening on ' + bind);
}
