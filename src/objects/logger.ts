import express from 'express';
import * as mongoDB from "mongodb";
import { level } from 'winston';

const winston = require('winston');
const winstonMdb = require('winston-mongodb');
const { format } = winston;
const { combine, label, json, timestamp, simple, colorize } = format;


class Lgr {
    mongoClient: mongoDB.MongoClient | null = null;
    loggingDb: mongoDB.Db | null = null;

    constructor() {
        console.log('Constructing Logger');

        this.dbSetup();

        console.log('Done constructing Logger');
    }

    async dbSetup () {
        this.mongoClient = new mongoDB.MongoClient(
            process.env.LOGGING_MONGODB_CLUSTER_CONN_STRING! + process.env.LOGGING_MONGODB_DB! + process.env.LOGGING_MONDODB_OPTIONS
        );

        await this.mongoClient.connect();

        this.loggingDb = await this.mongoClient.db(process.env.LOGGING_MONGODB_DB);

        console.log('info', 'Connected correctly to MongoDb database: ' + process.env.LOGGING_MONGODB_COLLECTION);

        const winstonMongoDbOptions = {
            db: this.loggingDb,
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

        this.log('info', 'Node startup, logging configured');
    }

    public log (level: string, message: string, metadata?: any ) {
        winston.log({level: level, message: message, metadata: metadata});
    }

    public getLogs(req: express.Request) {
        return new Promise ( async (resolve, reject) => {
            try {
                const filterParams: any = {};
                if (req.body.level) { filterParams.level = req.body.level; }

                const sortParams: any = {timestamp: -1};

                if (!this.loggingDb) { throw new Error ('Logging DB not configured.'); }

                const mdbResults = await this.loggingDb.collection(process.env.LOGGING_MONGODB_COLLECTION!)
                    .find(filterParams)
                    .sort(sortParams)
                    .skip(req.body.from)
                    .limit(req.body.size);

                const array = await mdbResults.toArray();
                const count = await mdbResults.count();

                return resolve({itemsFound: count, hits: array});
            } catch (err: any) {
                return reject (err);
            }
        });
    }
}

export const logger: Lgr = new Lgr();

