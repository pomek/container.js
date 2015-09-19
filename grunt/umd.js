module.exports = function (grunt, options) {
    return {
        default: {
            src: 'src/Container.js',
            dest: 'dist/Container.js',
            objectToExport: 'Container'
        }
    };
};

