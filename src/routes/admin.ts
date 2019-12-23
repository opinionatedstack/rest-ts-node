import express from 'express';
const router = express.Router();
const auth0 = require ('../objects/auth0');
const jwtAuthz = require('express-jwt-authz');
const logger = require('./../objects/logger');

router.post('/getUsers', jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getUsers(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/getUsers', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/getUser',  jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getUser(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/getUsers', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/updateUser',  jwtAuthz([ 'users:read', 'users:write' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.updateUser(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/updateUser', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/getRoles',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getRoles(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/getRoles', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/setUsersStripeCustomerId',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.setUsersStripeCustomerId(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/setUsersStripeCustomerId', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/getLogs',  jwtAuthz([ 'logs:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await logger.getLogs(req);
        res.json(result);
    } catch (err) {
        logger.log('error', 'Error in POST admin/getLogs', err);
        res.status(err.statusCode).json(err);
    }
});

module.exports = router;
