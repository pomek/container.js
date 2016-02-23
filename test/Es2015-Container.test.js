(function (global) {
    "use strict";

    const Container = require('../dist/Es2015-Container.js'),
        Window = require('./stubs/Window'),
        Home = require('./stubs/Home');

    module.exports = require('./Specs')(Container, Window, Home);
})(module);
