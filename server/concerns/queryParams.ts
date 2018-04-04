export const getParams = (required: Array<string>, bodyParam: {}) => {
    let params = {};

    required.forEach((req) => {
        params[req] = bodyParam[req];
    });

    return params;
};

export const getFilledParams = (required: Array<string>, bodyParam: {}) => {
    let params = {};

    required.forEach((req) => {
        if (bodyParam[req] && bodyParam[req] !== '') {
            params[req] = bodyParam[req];
        }
    });

    return params;
};
