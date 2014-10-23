var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var files = {
    src: 'src/calico.js'
};

gulp.task('build', function() {
    return gulp.src(files.src)
    .pipe(concat('calico.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});
