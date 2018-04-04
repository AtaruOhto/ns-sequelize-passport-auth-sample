const bcrypt = require('bcrypt');

export const comparePlainWithHash = (plainText: string, encrypted: string): Promise<any> => (
    new Promise((resolve, reject) => {
        bcrypt.compare(plainText, encrypted, (error: any, isEqual: boolean) => {
            if (error) {
                reject(error);
            }
            resolve(isEqual);
        });
    })
)

export const genHash = (plainText: string, saltRounds: number = 10): Promise<any> => (
    new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (error: any, salt: string) => {
            if (error) {
                reject(error);
            }

            bcrypt.hash(plainText, salt, (hashError: any, encrypted: string) => {
                if (hashError) {
                    reject(hashError);
                }
                resolve(encrypted);
            });
        });
    })
)
