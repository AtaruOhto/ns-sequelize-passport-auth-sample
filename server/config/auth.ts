import { Express, Request } from 'express';
import { PassportStatic } from 'passport';
import passport from 'passport';
import {Strategy as LocalStrategy } from 'passport-local';

import { findOneUser, TUser } from 'models/user';
import { comparePlainWithHash } from 'concerns/bcrypt';

const authSuccess = (done: Function, user: TUser, req: Request): Function => {
    const msg = 'LOGIN SUCCESS';
    console.log(msg + user.name);
    return done(null, user);
};

const authFailed = (done: Function, req: Request, error = ''): Function => {
    const msg = 'LOGIN FAILED';
    console.error(msg + error);
    return done(null, false);
};

const usePassportLocalStrategy = (passportStatic: PassportStatic) => {
    passportStatic.serializeUser(function (user: TUser, done: Function) {
        done(null, user);
    });

    passportStatic.deserializeUser(function (user: TUser, done: Function) {
        done(null, user);
    });

    passportStatic.use(new LocalStrategy(
        {passReqToCallback: true, }, async(req: Request, name: string, password: string, done: Function) => {
            const user = await findOneUser({name: name}).catch((error: any) => {
                return authFailed(done, req, error);
            });

            if (!(user)) {
                return authFailed(done, req, ` User ${name} does not exist!`);
            }

            const isPasswordValid = await comparePlainWithHash(password, user.password).catch((error: any) => {
                return authFailed(done, req, error);
            });

            return isPasswordValid ? authSuccess(done, user, req) : authFailed(done, req);
        }));
};

const usePassport = (app: Express) => {
    app.use(passport.initialize());
    app.use(passport.session());
    usePassportLocalStrategy(passport);
};

export const useAuthMiddlewares = (app: Express) => {
    usePassport(app);
};

export const getPassport = () => (
    passport
);
