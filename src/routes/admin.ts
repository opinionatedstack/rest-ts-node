import express from 'express';
const router = express.Router();
import { Auth0 } from '../objects/auth0';
const jwtAuthz = require('express-jwt-authz');
import { logger } from '../objects/logger';

router.post('/getUsers', jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await Auth0.getUsers(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/getUsers', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/getUser',  jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await Auth0.getUser(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/getUsers', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/updateUser',  jwtAuthz([ 'users:read', 'users:write' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await Auth0.updateUser(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/updateUser', err);
        res.status(err.statusCode).json(err);
    }
});

router.post('/getRoles',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await Auth0.getRoles(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/getRoles', err);
        res.status(err.statusCode).json(err);
    }
});

/* For Stripe Integration
router.post('/setUsersStripeCustomerId',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await Auth0.setUsersStripeCustomerId(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/setUsersStripeCustomerId', err);
        res.status(err.statusCode).json(err);
    }
});
 */

router.post('/getLogs',  jwtAuthz([ 'logs:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await logger.getLogs(req);
        res.json(result);
    } catch (err: any) {
        logger.log('error', 'Error in POST admin/getLogs', err);
        res.status(err.statusCode).json(err);
    }
});

module.exports = router;
