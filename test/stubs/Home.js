var Home = function (window) {
    this.window = window;
};

Home.prototype.getWindow = function () {
    return this.window;
};

module.exports = Home;
