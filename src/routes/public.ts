import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'Sucessful public GET',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString())
        };
        res.json(result);
    } catch (e) {
        res.status(500).json({ statusCode: 500, message: e.message });
    }
});

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'Successful public POST',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString()),
            echoedData: req.body
        };
        res.json(result);
    } catch (e) {
        res.status(500).json({ statusCode: 500, message: e.message });
    }
});

router.get('/generatesError', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'This public GET should fail',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString())
        };
        throw new Error('Forced error'); // Generate error
        res.json(result);
    } catch (e) {
        res.status(500).json({ statusCode: 500, message: e.message });
    }
});

module.exports = router;
