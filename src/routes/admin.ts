import express from 'express';
const router = express.Router();
const auth0 = require ('../objects/auth0');
const jwtAuthz = require('express-jwt-authz');

router.post('/getUsers', jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getUsers(req);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode).json(error);
    }
});

router.post('/getUser',  jwtAuthz([ 'users:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getUser(req);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode).json(error);
    }
});

router.post('/updateUser',  jwtAuthz([ 'users:read', 'users:write' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.updateUser(req);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode).json(error);
    }
});

router.post('/getRoles',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.getRoles(req);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode).json(error);
    }
});

router.post('/setUsersStripeCustomerId',  jwtAuthz([ 'roles:read' ]), async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result: any = await auth0.setUsersStripeCustomerId(req);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode).json(error);
    }
});

module.exports = router;
