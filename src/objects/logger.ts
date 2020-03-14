import express from 'express';
import {Db, MongoClient, MongoClientOptions} from 'mongodb';
import {level} from 'winston';

const winston = require('winston');
const winstonMdb = require('winston-mongodb');
const { format } = winston;
const { combine, label, json, timestamp, simple, colorize } = format;

const mongoDbLogClient: MongoClient = new MongoClient(
    process.env.LOGGING_MONGODB_CLUSTER_CONN_STRING! + process.env.LOGGING_MONGODB_DB! + process.env.LOGGING_MONDODB_OPTIONS,
    { useNewUrlParser: true, useUnifiedTopology: true });

let loggingDb: Db;
try {
    mongoDbLogClient.connect()
        .then(async (r: any) => {
            console.log('info', 'Connected correctly to MongoDb server');
            loggingDb = await mongoDbLogClient.db(process.env.LOGGING_MONGODB_DB);
            console.log('info', 'Connected correctly to MongoDb database: ' + process.env.LOGGING_MONGODB_COLLECTION);

            const winstonMongoDbOptions = {
                db: loggingDb,
                collection: process.env.LOGGING_MONGODB_COLLECTION,
                capped: process.env.LOGGING_CAPPED,
                cappedMax: parseInt((process.env.LOGGING_CAP_COUNT? process.env.LOGGING_CAP_COUNT: '1000')),
                metaKey: 'metadata',
                level: process.env.LOGGING_MIN_LEVEL_MONGODB_LOGGED
            };
            const winstonConsoleOptions = {
                level: process.env.LOGGING_MIN_LEVEL_CONSOLE_LOGGED,
                format: combine(
                    timestamp(),
                    colorize({all: true}),
                    simple()
                )
            };

            winston.add(new winston.transports.MongoDB(winstonMongoDbOptions));
            winston.add(new winston.transports.Console(winstonConsoleOptions));

            module.exports.log('info', 'Node startup, logging configured');

        }, (err: any) => {
            // Logging not started
            console.log('error', 'Error connecting to MongoDb server or db: ' + process.env.LOGGING_MONGODB_COLLECTION, err);
        });
} catch (err) {
    // Logging not started
    console.log('error', 'Error connecting MongoDb client', err);
}

module.exports = {
    log: (level: string, message: string, metadata:any ) => {
        winston.log({level: level, message: message, metadata: metadata});
    },

    getLogs: (req: express.Request) => {
        return new Promise ( async (resolve, reject) => {
            try {
                const filterParams: any = {};
                if (req.body.level) { filterParams.level = req.body.level; }

                const sortParams: any = {timestamp: -1};

                const mdbResults = await loggingDb.collection(process.env.LOGGING_MONGODB_COLLECTION!)
                    .find(filterParams)
                    .sort(sortParams)
                    .skip(req.body.from)
                    .limit(req.body.size);

                const array = await mdbResults.toArray();
                const count = await mdbResults.count();

                return resolve({itemsFound: count, hits: array});
            } catch (err) {
                return reject (err);
            }
        });
    }
};
