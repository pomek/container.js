var Window = function (date) {
    this.date = date;
};

Window.prototype.getDate = function () {
    return this.date;
};

module.exports = Window;
