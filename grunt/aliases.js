module.exports = function (grunt, options) {
    return {
        "default": [
            "build",
            "test"
        ],
        "test": "nodeunit",
        "build": [
            "umd",
            "uglify"
        ]
    };
};

