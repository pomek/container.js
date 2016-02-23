(function (gulp) {
    "use strict";

    const umd = require('gulp-umd'),
        nodeunit = require('gulp-nodeunit'),
        babel = require('gulp-babel'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename');

    let path = {
        test: './test/**/*.test.js',
        source: './src/**/*',
        dist: './dist'
    };

    // Build module for ES5
    gulp.task('umd', () => {
        return gulp.src(path.source)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(umd())
            .pipe(gulp.dest(path.dist));
    });

    // Build module for ES2015 (ES6)
    gulp.task('es2015umd', () => {
        return gulp.src(path.source)
            .pipe(umd())
            .pipe(rename({
                prefix: 'Es2015-'
            }))
            .pipe(gulp.dest(path.dist));
    });

    // Tests
    gulp.task('test', ['umd', 'es2015umd'], () => {
        return gulp.src(path.test)
            .pipe(nodeunit());
    });

    // Compress ES5 module
    gulp.task('uglify', ['test'], () => {
        return gulp.src([
                path.dist + '/*.js',
                '!' + path.dist + '/*.min.js',
                '!' + path.dist + '/Es2015*.js'
            ])
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(path.dist));
    });

    gulp.task('default', ['uglify']);
})(require('gulp'));
