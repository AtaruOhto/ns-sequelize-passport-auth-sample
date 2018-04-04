const Sequelize = require('sequelize');
import { Model } from 'sequelize';
const Op = Sequelize.Op;
import { genHash } from 'concerns/bcrypt';
const appRoot = require('app-root-path');

interface IUserAttrs {
    name: string;
    password: string;
}

interface IUserOptionalAttrs {
    name?: string;
    password?: string;
}

export type TUser = Model<'user', IUserAttrs>;

const dataFile = appRoot + '/data.sqlite';
export const sequelizeInstance = new Sequelize(
    'sample_db', null, null, {
        dialect: 'sqlite',
        storage: dataFile,
        operatorsAliases: Op
    }
);

export const UserModel = sequelizeInstance.define('user', {
    name: {type: Sequelize.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.STRING, allowNull: false},
});

export const createUser = (attrs: IUserAttrs) => (
    new Promise(async (resolve, reject) => {
        attrs.password = await genHash(attrs.password).catch((error: any) => {
            reject(error);
        });

        UserModel.create(attrs).then(
            (instance: any) => {
                resolve(instance);
            }, (error: any) => {
                reject(error);
            });
    })
);

export const findOneUser  = (attrs: IUserOptionalAttrs): Promise<any> => (
    new Promise((resolve, reject) => {
        UserModel.findOne({where: attrs}).then(
            (instance: TUser) => {
                resolve(instance);
            },
            (error: any) => {
                reject(error);
            });
    })
);

const createFirstUserIfNotExist = async () => {
    const numOfUser = await UserModel.count().catch((error: any) => { console.error(error); });

    if (numOfUser === 0) {
        createUser({name: 'first', password: 'pass'}).catch((error: any) => { console.error(error); });
        console.log('first user created!');
    }
};

(() =>  {
    sequelizeInstance.sync().then(
        () => {
            console.log('Database synced');
            if (process.env.CREATE_USER_IF_NOT_EXITS) {
                createFirstUserIfNotExist();
            }
        },
        (error: any) => {
            console.error(error);
        });
})();
