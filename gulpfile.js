'use strict';
var gulp = require('gulp');

gulp.task('copy-frontend-files', function () {
  gulp.src(['bower_components/bootstrap/dist/**/*'])
    .pipe(gulp.dest('public'));
  gulp.src(['bower_components/jquery/dist/**/*'])
    .pipe(gulp.dest('public/js'))
});

gulp.task('default', ['copy-frontend-files']);
