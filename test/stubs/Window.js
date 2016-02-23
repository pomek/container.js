(function (global) {
    "use strict";

    module.exports = class Window {
        constructor (date) {
            this.date = date
        }

        getDate () {
            return this.date;
        }
    }
})(module);
