const
    /**
     * Parse Basic authentication header and return decoded credentials
     * @param {string} digest
     * @returns {{username: string, password: string}}
     */
    basicAuthParser = (digest) => {
        const [username, password] = Buffer.from(digest, 'base64')
            .toString('utf8')
            .split(':');

        return {username, password};
    },

    /**
     * Parse Bearer authentication header
     * (in this case we just return the token since it is already in a plain text)
     * @param {string} digest
     * @returns {{token: string}}
     */
    bearerAuthParser = (digest) => {
        return {token: digest};
    },

    /**
     * Parse Digest authentication header
     * Return credentials and vault with all parsed values
     * @param {string} digest
     * @returns {{username: string, password: string, vault: Object}}
     */
    digestAuthParser = (digest) => {
        const params = digest.split(','),
            vault = params.reduce((result, param) => {
                const [key, value] = param.trim().split('=');
                result[key] = value.replace(/"/g, '');
                return result;
            }, {});

        return {
            username: vault.username,
            password: vault.password,
            vault
        };
    },

    /**
     * If the method is unknown, just return the digest
     * @param {string} digest
     * @returns {{digest: string}}
     */
    defaultParser = (digest) => {
        return {digest};
    },

    PARSERS = {
        'basic': basicAuthParser,
        'bearer': bearerAuthParser,
        'digest': digestAuthParser
    },

    /**
     * Split the given auth string into scheme and digest
     * @param {string} auth
     * @returns {{scheme: string, digest: string}}
     */
    splitAuthHeader = (auth) => {
        const pattern = /^\s*(\w+)\s+(.*)$/,
            [, scheme, digest] = pattern.exec(auth) || [];

        return {scheme, digest};
    },

    /**
     * Auth parsing middleware
     * @param {{propName: string}} config
     * @returns {func}
     */
    authParseMiddleware = (config) => {
        const {propName = 'auth'} = config || {};

        return (ctx, next) => {
            if (ctx.header && ctx.header.authorization) {
                const {authorization: auth} = ctx.header,
                    {scheme, digest} = splitAuthHeader(auth);

                if (scheme) {
                    const parser = PARSERS[scheme.toLowerCase()] || defaultParser,
                        props = parser(digest);

                    ctx.state[propName] = {
                        digest,
                        scheme,
                        ...props
                    };
                }
            }

            return next();
        };
    };

const Module = module.exports = authParseMiddleware;
Module.splitAuthHeader = splitAuthHeader;
