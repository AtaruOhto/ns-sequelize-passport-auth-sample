import { Express, Response, Request, NextFunction } from 'express';
import { getPassport } from 'config/auth';

export const loginRoute = '/login';
export const secretRoute = '/secret';
export const logoutRoute = '/logout';
const loginView = 'login';
const secretView = 'secret';

export const redirectToLogin = (res: Response) => {
    return res.redirect(loginRoute);
}

export const redirectUnlessSession = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return res.redirect(loginRoute);
    }
    return next();
};

export const redirectIfSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return res.redirect(secretRoute);
    }
    return next();
};

export const defineRoutes = (app: Express) => {

    app.get(
        loginRoute,
        redirectIfSession,
        (req: Request, res: Response) => {
            res.render(
                loginView,
                {
                    loginPath: loginRoute
                }
            );
        });

    app.post(
        loginRoute,
        getPassport().authenticate('local', {
            successRedirect: secretRoute,
            failureRedirect: loginRoute,
            successFlash: true,
            failureFlash: true
        }),
    );

    app.get(secretRoute, redirectUnlessSession, (req: Request, res: Response) => {
        if (!(req.user)) {
            console.error('User is null');
            return redirectToLogin(res);
        }

        res.render(
            secretView,
            {
                user: req.user,
                logoutPath: logoutRoute + '?_method=DELETE'
            }
        );
    });

    app.delete(logoutRoute, redirectUnlessSession, (req: Request, res: Response) => {
        req.logout();
        res.redirect(loginRoute);
    });
}
