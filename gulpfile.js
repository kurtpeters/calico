var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    qunit = require('gulp-qunit');

var files = {
    "src": 'src/calico.js',
    "test": 'tests/index.html'
};

gulp.task('build', function() {
    return gulp.src(files.src)
    .pipe(concat('calico.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('test', function() {
    return gulp.src(files.test)
    .pipe(qunit());
});
