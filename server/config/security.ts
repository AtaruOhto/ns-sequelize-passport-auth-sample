import { Express } from 'express';
const helmet = require('helmet');
const lusca = require('lusca');

const useHelmet = (app: Express) => {
    app.use(helmet());
};

const useLuscaCsrf = (app: Express) => {
    app.use(lusca.csrf());
};

export const useSecurityMiddlewares = (app: Express) => {
    useHelmet(app);
    useLuscaCsrf(app);
};
