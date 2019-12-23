import express from 'express';
const router = express.Router();
const logger = require('./../objects/logger');

const jwtAuthz = require('express-jwt-authz');

router.get('/',  (req: express.Request, res: express.Response, next: express.NextFunction) =>  {
    try {
        const result = {
            status: 'success',
            message: 'Sucessful private GET',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString())
        };
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in GET public/generatesError', err);
        res.status(500).json(err);
    }
});

router.post('/',  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'Successful private POST',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString()),
            echoedData: req.body
        };
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in GET public/generatesError', err);
        res.status(500).json(err);
    }
});

// These two permissions are not assigned to anyone in the demo site
router.post('/requireNeverPermission', jwtAuthz([ 'read:never', 'write:never' ]), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'Successful private permissioned POST',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString()),
            echoedData: req.body
        };
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in GET public/generatesError', err);
        res.status(500).json(err);
    }
});

// Some users in the demo site have Post permissions
//
router.post('/requirePostPermission', jwtAuthz([ 'post:read', 'post:write' ]), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = {
            status: 'success',
            message: 'Successful private permissioned POST',
            dotEnvTestValue: process.env.SAMPLE_TEXT,
            dateTime: (new Date().toLocaleTimeString()),
            echoedData: req.body
        };
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in GET public/generatesError', err);
        res.status(500).json(err);
    }
});

module.exports = router;
