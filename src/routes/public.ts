import express from 'express';
const router = express.Router();
const logger = require('./../objects/logger');

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 200,
            message: 'Sucessful public GET',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString())
        };
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in GET public/', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 200,
            message: 'Successful public POST',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString()),
            echoedData: req.body
        };
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST public/', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

router.get('/generatesError', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 200,
            message: 'This public GET should fail',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString())
        };

        throw new Error('Forced error'); // Generate error

        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in GET public/generatesError', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

module.exports = router;
