const generateCacheKey = (prefix, query) => {

    const sortedKeys =
        Object.keys(query).sort();

    const queryString =
        sortedKeys
            .map(
                key =>
                    `${key}=${query[key]}`
            )
            .join(":");

    if (!queryString) {
        return prefix;
    }

    return `${prefix}:${queryString}`;

};

module.exports = generateCacheKey;