(function (global) {
    "use strict";

    module.exports = class Home {
        constructor (window) {
            this.window = window
        }

        getWindow () {
            return this.window;
        }
    }
})(module);
