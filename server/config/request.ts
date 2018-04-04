import { Express } from 'express';
import * as bodyParser from 'body-parser';
import methodOverride from 'method-override';

const useMethodOverride = (app: Express) => {
    app.use(methodOverride('_method'));
};

const useBodyParser = (app: Express) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
};

export const useRequestMiddlewares = (app: Express) => {
    useBodyParser(app);
    useMethodOverride(app);
};
