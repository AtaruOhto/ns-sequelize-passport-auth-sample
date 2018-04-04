import {Express} from 'express';

export const setViewEngine = (app: Express) => {
    app.set('view engine', 'pug');
};
