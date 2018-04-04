import { Express } from 'express';
const cookieParser = require('cookie-parser');
const session = require('express-session');

const useCookieParser = (app: Express) => {
    app.use(cookieParser());
};

/*
* connection.session() MemoryStore is not
designed for a production environment.
It only for development or test use.
Consider to use Redis or other databases as a session store.
*/

const useSession = (app: Express) => {
    app.use(session(
        {
            secret: process.env.SECRET_KEY_BASE,
            resave: true,
            saveUninitialized: true,
            maxAge: 1000 * 60 * 60 * 90,
            cookie: {
                path: '/'
            }
        }
        )
    );
};

export const useSessionMiddlewares = (app: Express) => {
    useCookieParser(app);
    useSession(app);
};