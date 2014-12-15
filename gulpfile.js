var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('build', function() {

    'use strict';

    return gulp.src('src/calico.js')
    .pipe(concat('calico.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));

});
