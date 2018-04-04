require('dotenv').config();
require('app-module-path').addPath(__dirname);
import express, { Express } from 'express';
import { defineRoutes } from 'config/routes';
import { useSecurityMiddlewares } from 'config/security';
import { useRequestMiddlewares } from 'config/request';
import { setViewEngine } from 'config/viewEngine';
import { useAuthMiddlewares } from 'config/auth';
import { useSessionMiddlewares } from 'config/session';

const listen = (app: Express) => {
    app.listen(process.env.APP_PORT, () => {
        console.log('Node Process is running at port : ' + process.env.APP_PORT);
    });
};

const defRoutes = (app: Express) => {
    defineRoutes(app);
};

const configureServer = (app: Express) => {
    useRequestMiddlewares(app);
    setViewEngine(app);
    useSessionMiddlewares(app);
    useSecurityMiddlewares(app);
    useAuthMiddlewares(app);
};

const startServer = () => {
    const app = express();
    configureServer(app);
    defRoutes(app);
    listen(app);
};

startServer();
