module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "globals": {
        "appTool": true,
        "require": true,
        "$": true,
        "ant": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "rules": {
        "no-console": "warn"
    }
};