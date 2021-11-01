
module.exports = {
    entry: './background.js',
    experiments: {
        topLevelAwait: true
    },
    mode: "development",
    resolve: {
        fallback: {
            "path": false, "os": false, "fs": false
        }
    }
};