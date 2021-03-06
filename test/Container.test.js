(function (global) {
    "use strict";

    const Container = require('../dist/Container.js'),
        Window = require('./stubs/Window'),
        Home = require('./stubs/Home');

    module.exports = require('./Specs')(Container, Window, Home);
})(module);
